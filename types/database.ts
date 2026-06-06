/**
 * Tipos de la base de datos generados con la CLI de Supabase.
 * Regenerar tras cambios de esquema con:
 *   supabase gen types typescript --project-id <id> > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      entitlements: {
        Row: {
          expires_at: string | null;
          source: string;
          tier: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          expires_at?: string | null;
          source?: string;
          tier?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          expires_at?: string | null;
          source?: string;
          tier?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      episodes: {
        Row: {
          created_at: string;
          description: string | null;
          duration_seconds: number | null;
          id: string;
          is_published: boolean;
          mux_asset_id: string | null;
          mux_playback_id: string | null;
          position: number;
          series_id: string;
          status: string;
          thumbnail_url: string | null;
          title: string;
          video_url: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          duration_seconds?: number | null;
          id?: string;
          is_published?: boolean;
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;
          position?: number;
          series_id: string;
          status?: string;
          thumbnail_url?: string | null;
          title: string;
          video_url?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          duration_seconds?: number | null;
          id?: string;
          is_published?: boolean;
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;
          position?: number;
          series_id?: string;
          status?: string;
          thumbnail_url?: string | null;
          title?: string;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "episodes_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "series";
            referencedColumns: ["id"];
          },
        ];
      };
      favorites: {
        Row: {
          created_at: string;
          series_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          series_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          series_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "series";
            referencedColumns: ["id"];
          },
        ];
      };
      feed_clips: {
        Row: {
          caption: string | null;
          created_at: string;
          id: string;
          is_published: boolean;
          mux_asset_id: string | null;
          mux_playback_id: string | null;
          position: number;
          poster_url: string | null;
          series_id: string;
          status: string;
          video_url: string | null;
        };
        Insert: {
          caption?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;
          position?: number;
          poster_url?: string | null;
          series_id: string;
          status?: string;
          video_url?: string | null;
        };
        Update: {
          caption?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;
          position?: number;
          poster_url?: string | null;
          series_id?: string;
          status?: string;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feed_clips_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "series";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      sections: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          kind: string;
          position: number;
          slug: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          kind?: string;
          position?: number;
          slug: string;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          kind?: string;
          position?: number;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      series: {
        Row: {
          cover_url: string | null;
          created_at: string;
          description: string | null;
          id: string;
          is_published: boolean;
          position: number;
          required_tier: string;
          section_id: string;
          slug: string;
          title: string;
        };
        Insert: {
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean;
          position?: number;
          required_tier?: string;
          section_id: string;
          slug: string;
          title: string;
        };
        Update: {
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean;
          position?: number;
          required_tier?: string;
          section_id?: string;
          slug?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "series_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "sections";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: { role: string; user_id: string };
        Insert: { role?: string; user_id: string };
        Update: { role?: string; user_id?: string };
        Relationships: [];
      };
      watch_progress: {
        Row: {
          completed: boolean;
          episode_id: string;
          position_seconds: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          episode_id: string;
          position_seconds?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          episode_id?: string;
          position_seconds?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "watch_progress_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
