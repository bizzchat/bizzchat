export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      datasources: {
        Row: {
          created_at: string | null
          datastore_id: string | null
          id: string
          meta: Json
          status: Database["public"]["Enums"]["datasources_status_enum"]
          type: string | null
        }
        Insert: {
          created_at?: string | null
          datastore_id?: string | null
          id?: string
          meta?: Json
          status?: Database["public"]["Enums"]["datasources_status_enum"]
          type?: string | null
        }
        Update: {
          created_at?: string | null
          datastore_id?: string | null
          id?: string
          meta?: Json
          status?: Database["public"]["Enums"]["datasources_status_enum"]
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "datasources_datastore_id_fkey"
            columns: ["datastore_id"]
            referencedRelation: "datastores"
            referencedColumns: ["id"]
          }
        ]
      }
      datastores: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          organization_id: string | null
          roles: Json[]
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          roles?: Json[]
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          roles?: Json[]
        }
        Relationships: [
          {
            foreignKeyName: "datastores_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          logo: string | null
          name: string | null
          photo: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          logo?: string | null
          name?: string | null
          photo?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo?: string | null
          name?: string | null
          photo?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          organization_id?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      datasources_status_enum: "queued" | "processing" | "ready"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
