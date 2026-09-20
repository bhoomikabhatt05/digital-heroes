export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "user" | "admin";
  charity_id: string | null;
  charity_percentage: number;
  created_at: string;
};

export type Charity = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
};

export type Score = {
  id: string;
  user_id: string;
  score: number;
  played_on: string;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan: "monthly" | "yearly";
  status: "active" | "inactive" | "cancelled" | "past_due";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
};

export type Draw = {
  id: string;
  draw_date: string;
  status: "draft" | "simulated" | "published" | "completed";
  draw_type: "random" | "algorithmic";
  winning_numbers: number[] | null;
  prize_pool: number;
  jackpot_rollover: number;
  simulation_data: unknown | null;
  created_at: string;
};

export type DrawEntry = {
  id: string;
  draw_id: string;
  user_id: string;
  numbers: number[];
  created_at: string;
};

export type DrawResult = {
  id: string;
  draw_id: string;
  user_id: string;
  match_count: number;
  prize_amount: number;
  created_at: string;
};

export type Winner = {
  id: string;
  draw_id: string;
  user_id: string;
  match_count: number;
  prize_amount: number;
  verification_status: "pending" | "verified" | "rejected";
  payment_status: "pending" | "paid";
  created_at: string;
};

export type WinnerProof = {
  id: string;
  winner_id: string;
  user_id: string;
  proof_path: string;
  created_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  subscription_id: string | null;
  stripe_payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};
