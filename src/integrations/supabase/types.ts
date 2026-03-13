export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            customers: {
                Row: {
                    id: string
                    name: string
                    email: string
                    phone: string | null
                    company: string | null
                    status: string
                    created_at: string
                    updated_at: string
                    user_id: string | null
                    tenant_id: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    phone?: string | null
                    company?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                    user_id?: string | null
                    tenant_id?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    company?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                    user_id?: string | null
                    tenant_id?: string | null
                }
            }
            deals: {
                Row: {
                    id: string
                    title: string
                    value: number
                    stage: string
                    customer_id: string | null
                    created_at: string
                    updated_at: string
                    user_id: string | null
                    tenant_id: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    value?: number
                    stage?: string
                    customer_id?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id?: string | null
                    tenant_id?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    value?: number
                    stage?: string
                    customer_id?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id?: string | null
                    tenant_id?: string | null
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    price: number
                    stock: number
                    category: string | null
                    image_url: string | null
                    created_at: string
                    updated_at: string
                    user_id: string | null
                    tenant_id: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price?: number
                    stock?: number
                    category?: string | null
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id?: string | null
                    tenant_id?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    stock?: number
                    category?: string | null
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id?: string | null
                    tenant_id?: string | null
                }
            }
            tasks: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    status: string
                    priority: string
                    due_date: string | null
                    created_at: string
                    updated_at: string
                    user_id: string | null
                    tenant_id: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    status?: string
                    priority?: string
                    due_date?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id?: string | null
                    tenant_id?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    status?: string
                    priority?: string
                    due_date?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id?: string | null
                    tenant_id?: string | null
                }
            }
            tenants: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    settings: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    settings?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    settings?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    tenant_id: string | null
                    role: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    tenant_id?: string | null
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    tenant_id?: string | null
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
