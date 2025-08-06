export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          address: string | null
          bank_account: string | null
          bank_name: string | null
          biography: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          nif: string | null
          phone: string | null
          profile_image: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          biography?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          nif?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          biography?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          nif?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_products: {
        Row: {
          affiliate_id: string | null
          commission_rate: number
          created_at: string
          id: string
          product_id: string | null
        }
        Insert: {
          affiliate_id?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Update: {
          affiliate_id?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_products_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_profiles: {
        Row: {
          address: string | null
          affiliate_code: string | null
          bank_account: string | null
          city: string | null
          commission_rate: number | null
          country_code: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          nif: string | null
          phone: string | null
          profile_image: string | null
          referral_link: string | null
          social_media: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          affiliate_code?: string | null
          bank_account?: string | null
          city?: string | null
          commission_rate?: number | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          nif?: string | null
          phone?: string | null
          profile_image?: string | null
          referral_link?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          affiliate_code?: string | null
          bank_account?: string | null
          city?: string | null
          commission_rate?: number | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          nif?: string | null
          phone?: string | null
          profile_image?: string | null
          referral_link?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_profiles_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      affiliate_requests: {
        Row: {
          affiliate_id: string
          created_at: string
          id: string
          message: string | null
          producer_id: string
          product_id: string
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          created_at?: string
          id?: string
          message?: string | null
          producer_id: string
          product_id: string
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          created_at?: string
          id?: string
          message?: string | null
          producer_id?: string
          product_id?: string
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string
          currency_code: string
          currency_symbol: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          currency_code: string
          currency_symbol: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          currency_code?: string
          currency_symbol?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      course_comments: {
        Row: {
          content: string
          course_id: string
          created_at: string
          id: string
          module_id: string | null
          rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string
          id?: string
          module_id?: string | null
          rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string
          id?: string
          module_id?: string | null
          rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_comments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          drip_settings: Json | null
          id: string
          is_free_module: boolean | null
          materials: Json | null
          module_order: number
          module_type: string
          product_id: string
          selected_classes: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          drip_settings?: Json | null
          id?: string
          is_free_module?: boolean | null
          materials?: Json | null
          module_order?: number
          module_type?: string
          product_id: string
          selected_classes?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          drip_settings?: Json | null
          id?: string
          is_free_module?: boolean | null
          materials?: Json | null
          module_order?: number
          module_type?: string
          product_id?: string
          selected_classes?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      course_settings: {
        Row: {
          allow_comments: boolean | null
          allow_downloads: boolean | null
          certificate_enabled: boolean | null
          created_at: string
          drip_content: boolean | null
          forum_enabled: boolean | null
          id: string
          live_chat_enabled: boolean | null
          producer_id: string
          product_id: string
          settings_data: Json | null
          updated_at: string
        }
        Insert: {
          allow_comments?: boolean | null
          allow_downloads?: boolean | null
          certificate_enabled?: boolean | null
          created_at?: string
          drip_content?: boolean | null
          forum_enabled?: boolean | null
          id?: string
          live_chat_enabled?: boolean | null
          producer_id: string
          product_id: string
          settings_data?: Json | null
          updated_at?: string
        }
        Update: {
          allow_comments?: boolean | null
          allow_downloads?: boolean | null
          certificate_enabled?: boolean | null
          created_at?: string
          drip_content?: boolean | null
          forum_enabled?: boolean | null
          id?: string
          live_chat_enabled?: boolean | null
          producer_id?: string
          product_id?: string
          settings_data?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      download_logs: {
        Row: {
          created_at: string | null
          download_token: string
          downloaded_at: string | null
          file_size: number | null
          id: string
          ip_address: string | null
          product_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          download_token: string
          downloaded_at?: string | null
          file_size?: number | null
          id?: string
          ip_address?: string | null
          product_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          download_token?: string
          downloaded_at?: string | null
          file_size?: number | null
          id?: string
          ip_address?: string | null
          product_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "student_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          niche: string
          preview_image: string | null
          template_data: Json
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          niche: string
          preview_image?: string | null
          template_data: Json
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          niche?: string
          preview_image?: string | null
          template_data?: Json
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          created_at: string
          custom_settings: Json | null
          description: string | null
          id: string
          is_active: boolean | null
          niche: string
          page_slug: string
          producer_id: string
          product_id: string
          template_name: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_settings?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          niche: string
          page_slug: string
          producer_id: string
          product_id: string
          template_name: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_settings?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          niche?: string
          page_slug?: string
          producer_id?: string
          product_id?: string
          template_name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      module_materials: {
        Row: {
          created_at: string
          description: string | null
          duration: number | null
          file_path: string | null
          file_size: number | null
          file_url: string | null
          id: string
          material_order: number
          material_type: string
          mime_type: string | null
          module_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          file_path?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          material_order?: number
          material_type: string
          mime_type?: string | null
          module_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          file_path?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          material_order?: number
          material_type?: string
          mime_type?: string | null
          module_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_materials_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_videos: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          duration: number | null
          id: string
          is_active: boolean
          target_audience: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          duration?: number | null
          id?: string
          is_active?: boolean
          target_audience?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          duration?: number | null
          id?: string
          is_active?: boolean
          target_audience?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      producer_profiles: {
        Row: {
          address: string | null
          bank_account: string | null
          biography: string | null
          city: string | null
          commission_rate: number | null
          configuration: Json | null
          country_code: string | null
          created_at: string
          email: string | null
          expertise_areas: string[] | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          nif: string | null
          phone: string | null
          profile_image: string | null
          social_media: Json | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
          verification_status: string | null
        }
        Insert: {
          address?: string | null
          bank_account?: string | null
          biography?: string | null
          city?: string | null
          commission_rate?: number | null
          configuration?: Json | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          expertise_areas?: string[] | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          nif?: string | null
          phone?: string | null
          profile_image?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
          verification_status?: string | null
        }
        Update: {
          address?: string | null
          bank_account?: string | null
          biography?: string | null
          city?: string | null
          commission_rate?: number | null
          configuration?: Json | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          expertise_areas?: string[] | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          nif?: string | null
          phone?: string | null
          profile_image?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "producer_profiles_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      product_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          mime_type: string | null
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          mime_type?: string | null
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          mime_type?: string | null
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_files_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_verified_purchase: boolean | null
          product_id: string | null
          rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string | null
          rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          affiliate_approval_type: string | null
          affiliate_commission_rate: number | null
          allow_affiliates: boolean | null
          category: string
          content_url: string | null
          course_modules: Json | null
          created_at: string
          description: string | null
          "e-book": string
          file_url: string | null
          id: string
          image_url: string | null
          instructor: string | null
          name: string
          original_price: number | null
          price: number
          producer_id: string
          product_type: string
          rating: number | null
          sales_count: number
          status: string
          students_count: number | null
          thumbnail_url: string | null
          total_earnings: number
          updated_at: string
          views_count: number
        }
        Insert: {
          affiliate_approval_type?: string | null
          affiliate_commission_rate?: number | null
          allow_affiliates?: boolean | null
          category: string
          content_url?: string | null
          course_modules?: Json | null
          created_at?: string
          description?: string | null
          "e-book": string
          file_url?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          name?: string
          original_price?: number | null
          price: number
          producer_id: string
          product_type: string
          rating?: number | null
          sales_count?: number
          status?: string
          students_count?: number | null
          thumbnail_url?: string | null
          total_earnings?: number
          updated_at?: string
          views_count?: number
        }
        Update: {
          affiliate_approval_type?: string | null
          affiliate_commission_rate?: number | null
          allow_affiliates?: boolean | null
          category?: string
          content_url?: string | null
          course_modules?: Json | null
          created_at?: string
          description?: string | null
          "e-book"?: string
          file_url?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          name?: string
          original_price?: number | null
          price?: number
          producer_id?: string
          product_type?: string
          rating?: number | null
          sales_count?: number
          status?: string
          students_count?: number | null
          thumbnail_url?: string | null
          total_earnings?: number
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          user_type?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          affiliate_id: string | null
          amount: number
          buyer_email: string
          commission_amount: number | null
          created_at: string
          id: string
          payment_method: string
          producer_id: string | null
          product_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          buyer_email: string
          commission_amount?: number | null
          created_at?: string
          id?: string
          payment_method: string
          producer_id?: string | null
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          buyer_email?: string
          commission_amount?: number | null
          created_at?: string
          id?: string
          payment_method?: string
          producer_id?: string | null
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      student_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          max_students: number | null
          name: string
          producer_id: string
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          name: string
          producer_id: string
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          name?: string
          producer_id?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          country_code: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          learning_goals: string | null
          phone: string | null
          preferred_language: string | null
          profile_image: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          learning_goals?: string | null
          phone?: string | null
          preferred_language?: string | null
          profile_image?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          learning_goals?: string | null
          phone?: string | null
          preferred_language?: string | null
          profile_image?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      student_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          material_id: string | null
          module_id: string
          product_id: string
          progress_percentage: number | null
          updated_at: string
          user_id: string
          watch_time: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          material_id?: string | null
          module_id: string
          product_id: string
          progress_percentage?: number | null
          updated_at?: string
          user_id: string
          watch_time?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          material_id?: string | null
          module_id?: string
          product_id?: string
          progress_percentage?: number | null
          updated_at?: string
          user_id?: string
          watch_time?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          end_date: string
          id: string
          payment_method: string | null
          plan_type: string
          product_id: string
          start_date: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_date: string
          id?: string
          payment_method?: string | null
          plan_type: string
          product_id: string
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_date?: string
          id?: string
          payment_method?: string | null
          plan_type?: string
          product_id?: string
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          allowed_file_types: string[] | null
          auto_publish_on_sale: boolean | null
          commission_rate: number | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          maintenance_mode: boolean | null
          max_file_size_gb: number | null
          platform_name: string | null
          show_active_sales: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_file_types?: string[] | null
          auto_publish_on_sale?: boolean | null
          commission_rate?: number | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          maintenance_mode?: boolean | null
          max_file_size_gb?: number | null
          platform_name?: string | null
          show_active_sales?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_file_types?: string[] | null
          auto_publish_on_sale?: boolean | null
          commission_rate?: number | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          maintenance_mode?: boolean | null
          max_file_size_gb?: number | null
          platform_name?: string | null
          show_active_sales?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_access: {
        Row: {
          access_code: string
          access_expires_at: string | null
          access_granted_at: string
          created_at: string
          download_count: number | null
          download_limit: number | null
          download_token_expires_at: string | null
          id: string
          last_access_at: string | null
          last_download_at: string | null
          product_id: string
          secure_download_token: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_code?: string
          access_expires_at?: string | null
          access_granted_at?: string
          created_at?: string
          download_count?: number | null
          download_limit?: number | null
          download_token_expires_at?: string | null
          id?: string
          last_access_at?: string | null
          last_download_at?: string | null
          product_id: string
          secure_download_token?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_code?: string
          access_expires_at?: string | null
          access_granted_at?: string
          created_at?: string
          download_count?: number | null
          download_limit?: number | null
          download_token_expires_at?: string | null
          id?: string
          last_access_at?: string | null
          last_download_at?: string | null
          product_id?: string
          secure_download_token?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_access_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_level: number
          created_at: string
          id: string
          shared: boolean
          unlocked_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_level: number
          created_at?: string
          id?: string
          shared?: boolean
          unlocked_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_level?: number
          created_at?: string
          id?: string
          shared?: boolean
          unlocked_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bank_account: string | null
          birth_date: string | null
          city: string | null
          country_code: string | null
          created_at: string
          full_name: string | null
          id: string
          nif: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bank_account?: string | null
          birth_date?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          nif?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bank_account?: string | null
          birth_date?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          nif?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      video_materials: {
        Row: {
          created_at: string
          description: string | null
          duration: number | null
          file_path: string
          file_size: number | null
          id: string
          module_id: string
          thumbnail_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          file_path: string
          file_size?: number | null
          id?: string
          module_id: string
          thumbnail_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          file_path?: string
          file_size?: number | null
          id?: string
          module_id?: string
          thumbnail_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_materials_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          account_details: Json | null
          amount: number
          created_at: string
          id: string
          method: string
          minimum_amount: number | null
          processed_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_details?: Json | null
          amount: number
          created_at?: string
          id?: string
          method: string
          minimum_amount?: number | null
          processed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_details?: Json | null
          amount?: number
          created_at?: string
          id?: string
          method?: string
          minimum_amount?: number | null
          processed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_withdraw: {
        Args: { user_uuid: string; product_type: string }
        Returns: boolean
      }
      check_user_dependencies: {
        Args: { target_user_id: string }
        Returns: Json
      }
      expire_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_secure_download_token: {
        Args: {
          p_user_id: string
          p_product_id: string
          p_expires_in_hours?: number
        }
        Returns: string
      }
      get_affiliate_earnings: {
        Args: { affiliate_uuid: string }
        Returns: number
      }
      get_affiliate_link: {
        Args: { affiliate_code: string; product_id?: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_download_info: {
        Args: { p_user_id: string; p_product_id: string }
        Returns: Json
      }
      get_producer_earnings: {
        Args: { producer_uuid: string }
        Returns: number
      }
      get_producer_stats: {
        Args: { producer_uuid: string }
        Returns: {
          total_products: number
          total_sales: number
          total_earnings: number
          total_views: number
          conversion_rate: number
        }[]
      }
      has_active_subscription: {
        Args: { p_user_id: string; p_product_id: string }
        Returns: boolean
      }
      has_product_access: {
        Args: { p_product_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_module_unlocked: {
        Args: { p_user_id: string; p_module_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: { event_type: string; event_details?: Json }
        Returns: undefined
      }
      register_download: {
        Args: {
          p_token: string
          p_user_id: string
          p_product_id: string
          p_ip_address?: string
          p_user_agent?: string
          p_file_size?: number
        }
        Returns: boolean
      }
      safe_delete_user: {
        Args: { target_user_id: string }
        Returns: Json
      }
      validate_download_token: {
        Args: { p_token: string; p_user_id: string; p_product_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
