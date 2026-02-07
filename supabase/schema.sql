-- MealExchange Supabase Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  token_balance DECIMAL(10,2) DEFAULT 0,
  locked_tokens DECIMAL(10,2) DEFAULT 0,
  total_swaps INTEGER DEFAULT 0,
  trust_rating DECIMAL(2,1) DEFAULT 5.0,
  is_blacklisted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- LOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('hall', 'rc', 'nusc')) NOT NULL,
  default_price DECIMAL(3,1) NOT NULL
);

-- Insert default locations
INSERT INTO public.locations (name, type, default_price) VALUES
  ('Eusoff Hall', 'hall', 1.0),
  ('Kent Ridge Hall', 'hall', 1.0),
  ('King Edward VII Hall', 'hall', 1.0),
  ('Raffles Hall', 'hall', 1.0),
  ('Sheares Hall', 'hall', 1.0),
  ('Temasek Hall', 'hall', 1.0),
  ('RVRC', 'rc', 1.5),
  ('CAPT', 'rc', 1.5),
  ('RC4', 'rc', 1.5),
  ('Tembusu', 'rc', 1.5),
  ('Cinnamon', 'rc', 1.5),
  ('NUSC', 'nusc', 2.0)
ON CONFLICT DO NOTHING;

-- ============================================
-- OFFERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  location_id INTEGER REFERENCES public.locations(id),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  meal_date DATE,
  token_price DECIMAL(3,1) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('token', 'cash')) DEFAULT 'token',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  location_id INTEGER REFERENCES public.locations(id),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  meal_date DATE,
  token_price DECIMAL(3,1) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('token', 'cash')) DEFAULT 'token',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DEALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  offer_id UUID REFERENCES public.offers(id),
  request_id UUID REFERENCES public.requests(id),
  provider_id UUID REFERENCES public.profiles(id) NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  token_amount DECIMAL(3,1) NOT NULL,
  escrow_locked BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'accepted' CHECK (status IN ('accepted', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  deal_id UUID REFERENCES public.deals(id),
  type TEXT CHECK (type IN ('earn', 'spend', 'refund', 'escrow_lock', 'escrow_release')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- LOCATIONS policies (public read)
CREATE POLICY "Locations are viewable by everyone" ON locations FOR SELECT USING (true);

-- OFFERS policies
CREATE POLICY "Pending offers are viewable by everyone" ON offers FOR SELECT USING (status = 'pending' OR user_id = auth.uid());
CREATE POLICY "Users can create their own offers" ON offers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own offers" ON offers FOR UPDATE USING (auth.uid() = user_id);

-- REQUESTS policies
CREATE POLICY "Pending requests are viewable by everyone" ON requests FOR SELECT USING (status = 'pending' OR user_id = auth.uid());
CREATE POLICY "Users can create their own requests" ON requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own requests" ON requests FOR UPDATE USING (auth.uid() = user_id);

-- DEALS policies
CREATE POLICY "Users can view their own deals" ON deals FOR SELECT USING (auth.uid() = provider_id OR auth.uid() = buyer_id);
CREATE POLICY "Authenticated users can create deals" ON deals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Deal participants can update" ON deals FOR UPDATE USING (auth.uid() = provider_id OR auth.uid() = buyer_id);

-- TRANSACTIONS policies
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- MESSAGES policies
CREATE POLICY "Deal participants can view messages" ON messages FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM deals WHERE deals.id = messages.deal_id 
    AND (deals.provider_id = auth.uid() OR deals.buyer_id = auth.uid())
  ));
CREATE POLICY "Deal participants can send messages" ON messages FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM deals WHERE deals.id = deal_id 
    AND (deals.provider_id = auth.uid() OR deals.buyer_id = auth.uid())
  ));

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Lock tokens in escrow
CREATE OR REPLACE FUNCTION lock_tokens_in_escrow(
  p_user_id UUID,
  p_amount DECIMAL,
  p_deal_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Subtract from balance, add to locked
  UPDATE profiles 
  SET token_balance = token_balance - p_amount,
      locked_tokens = locked_tokens + p_amount
  WHERE id = p_user_id;
  
  -- Record transaction
  INSERT INTO transactions (user_id, deal_id, type, amount, description)
  VALUES (p_user_id, p_deal_id, 'escrow_lock', -p_amount, 'Tokens locked in escrow');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Complete deal and transfer tokens
CREATE OR REPLACE FUNCTION complete_deal_transfer(
  p_deal_id UUID,
  p_provider_id UUID,
  p_amount DECIMAL
) RETURNS VOID AS $$
DECLARE
  v_buyer_id UUID;
BEGIN
  -- Get buyer_id from deal
  SELECT buyer_id INTO v_buyer_id FROM deals WHERE id = p_deal_id;
  
  -- Release escrow from buyer's locked tokens
  UPDATE profiles 
  SET locked_tokens = locked_tokens - p_amount
  WHERE id = v_buyer_id;
  
  -- Add tokens to provider
  UPDATE profiles 
  SET token_balance = token_balance + p_amount
  WHERE id = p_provider_id;
  
  -- Record transactions
  INSERT INTO transactions (user_id, deal_id, type, amount, description)
  VALUES 
    (v_buyer_id, p_deal_id, 'spend', -p_amount, 'Meal payment completed'),
    (p_provider_id, p_deal_id, 'earn', p_amount, 'Earned from meal swap');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Refund escrow
CREATE OR REPLACE FUNCTION refund_escrow(
  p_deal_id UUID,
  p_buyer_id UUID,
  p_amount DECIMAL
) RETURNS VOID AS $$
BEGIN
  -- Return locked tokens to balance
  UPDATE profiles 
  SET token_balance = token_balance + p_amount,
      locked_tokens = locked_tokens - p_amount
  WHERE id = p_buyer_id;
  
  -- Record transaction
  INSERT INTO transactions (user_id, deal_id, type, amount, description)
  VALUES (p_buyer_id, p_deal_id, 'refund', p_amount, 'Escrow refunded - deal cancelled');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment swap count
CREATE OR REPLACE FUNCTION increment_swap_count(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET total_swaps = total_swaps + 1 WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for deals (for status updates)
ALTER PUBLICATION supabase_realtime ADD TABLE deals;
