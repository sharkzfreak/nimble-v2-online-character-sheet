export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      abilities: {
        Row: {
          category: string
          class_id: string | null
          created_at: string
          description: string
          id: string
          level_requirement: number | null
          name: string
          source_page: number | null
          subclass_id: string | null
          updated_at: string
        }
        Insert: {
          category: string
          class_id?: string | null
          created_at?: string
          description: string
          id?: string
          level_requirement?: number | null
          name: string
          source_page?: number | null
          subclass_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          class_id?: string | null
          created_at?: string
          description?: string
          id?: string
          level_requirement?: number | null
          name?: string
          source_page?: number | null
          subclass_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "abilities_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abilities_subclass_id_fkey"
            columns: ["subclass_id"]
            isOneToOne: false
            referencedRelation: "subclasses"
            referencedColumns: ["id"]
          },
        ]
      }
      ancestries: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          source_page: number | null
          stat_bonuses: Json | null
          traits: Json
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          source_page?: number | null
          stat_bonuses?: Json | null
          traits: Json
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          source_page?: number | null
          stat_bonuses?: Json | null
          traits?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      backgrounds: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          skill_bonus: string | null
          source_page: number | null
          starting_equipment: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          skill_bonus?: string | null
          source_page?: number | null
          starting_equipment?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          skill_bonus?: string | null
          source_page?: number | null
          starting_equipment?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          abilities: string | null
          armor: number | null
          background: string | null
          campaign: string | null
          class: string | null
          class_id: string | null
          created_at: string | null
          custom_features: Json | null
          custom_inventory: Json | null
          custom_spells: Json | null
          description: string | null
          dex_mod: number | null
          dexterity: number
          dice_presets: Json | null
          equipment: Json | null
          favorites: Json | null
          hit_dice_remaining: number | null
          hit_dice_total: number | null
          hp_current: number | null
          hp_max: number | null
          hp_temp: number | null
          id: string
          int_mod: number | null
          intelligence: number
          is_draft: boolean | null
          journal_entries: Json | null
          level: number
          level_history: Json | null
          name: string
          notes: string | null
          player: string | null
          portrait_url: string | null
          powers: string | null
          race: string | null
          skill_arcana: number | null
          skill_examination: number | null
          skill_finesse: number | null
          skill_influence: number | null
          skill_insight: number | null
          skill_lore: number | null
          skill_might: number | null
          skill_naturecraft: number | null
          skill_perception: number | null
          skill_stealth: number | null
          spells: string | null
          str_mod: number | null
          strength: number
          subclass_id: string | null
          updated_at: string | null
          user_id: string
          will: number
          will_mod: number | null
        }
        Insert: {
          abilities?: string | null
          armor?: number | null
          background?: string | null
          campaign?: string | null
          class?: string | null
          class_id?: string | null
          created_at?: string | null
          custom_features?: Json | null
          custom_inventory?: Json | null
          custom_spells?: Json | null
          description?: string | null
          dex_mod?: number | null
          dexterity?: number
          dice_presets?: Json | null
          equipment?: Json | null
          favorites?: Json | null
          hit_dice_remaining?: number | null
          hit_dice_total?: number | null
          hp_current?: number | null
          hp_max?: number | null
          hp_temp?: number | null
          id?: string
          int_mod?: number | null
          intelligence?: number
          is_draft?: boolean | null
          journal_entries?: Json | null
          level?: number
          level_history?: Json | null
          name: string
          notes?: string | null
          player?: string | null
          portrait_url?: string | null
          powers?: string | null
          race?: string | null
          skill_arcana?: number | null
          skill_examination?: number | null
          skill_finesse?: number | null
          skill_influence?: number | null
          skill_insight?: number | null
          skill_lore?: number | null
          skill_might?: number | null
          skill_naturecraft?: number | null
          skill_perception?: number | null
          skill_stealth?: number | null
          spells?: string | null
          str_mod?: number | null
          strength?: number
          subclass_id?: string | null
          updated_at?: string | null
          user_id: string
          will?: number
          will_mod?: number | null
        }
        Update: {
          abilities?: string | null
          armor?: number | null
          background?: string | null
          campaign?: string | null
          class?: string | null
          class_id?: string | null
          created_at?: string | null
          custom_features?: Json | null
          custom_inventory?: Json | null
          custom_spells?: Json | null
          description?: string | null
          dex_mod?: number | null
          dexterity?: number
          dice_presets?: Json | null
          equipment?: Json | null
          favorites?: Json | null
          hit_dice_remaining?: number | null
          hit_dice_total?: number | null
          hp_current?: number | null
          hp_max?: number | null
          hp_temp?: number | null
          id?: string
          int_mod?: number | null
          intelligence?: number
          is_draft?: boolean | null
          journal_entries?: Json | null
          level?: number
          level_history?: Json | null
          name?: string
          notes?: string | null
          player?: string | null
          portrait_url?: string | null
          powers?: string | null
          race?: string | null
          skill_arcana?: number | null
          skill_examination?: number | null
          skill_finesse?: number | null
          skill_influence?: number | null
          skill_insight?: number | null
          skill_lore?: number | null
          skill_might?: number | null
          skill_naturecraft?: number | null
          skill_perception?: number | null
          skill_stealth?: number | null
          spells?: string | null
          str_mod?: number | null
          strength?: number
          subclass_id?: string | null
          updated_at?: string | null
          user_id?: string
          will?: number
          will_mod?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_subclass_id_fkey"
            columns: ["subclass_id"]
            isOneToOne: false
            referencedRelation: "subclasses"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          armor: string | null
          complexity: number
          created_at: string
          description: string
          hit_die: string
          id: string
          key_stats: string[]
          name: string
          saves: string[]
          source_page: number | null
          starting_gear: string[]
          starting_hp: number
          updated_at: string
          weapons: string | null
        }
        Insert: {
          armor?: string | null
          complexity?: number
          created_at?: string
          description: string
          hit_die: string
          id?: string
          key_stats: string[]
          name: string
          saves: string[]
          source_page?: number | null
          starting_gear: string[]
          starting_hp: number
          updated_at?: string
          weapons?: string | null
        }
        Update: {
          armor?: string | null
          complexity?: number
          created_at?: string
          description?: string
          hit_die?: string
          id?: string
          key_stats?: string[]
          name?: string
          saves?: string[]
          source_page?: number | null
          starting_gear?: string[]
          starting_hp?: number
          updated_at?: string
          weapons?: string | null
        }
        Relationships: []
      }
      dice_logs: {
        Row: {
          character_id: string | null
          character_name: string
          created_at: string
          formula: string
          id: string
          individual_rolls: Json | null
          modifier: number
          raw_result: number
          roll_type: string
          total: number
          user_id: string
        }
        Insert: {
          character_id?: string | null
          character_name: string
          created_at?: string
          formula: string
          id?: string
          individual_rolls?: Json | null
          modifier?: number
          raw_result: number
          roll_type: string
          total: number
          user_id: string
        }
        Update: {
          character_id?: string | null
          character_name?: string
          created_at?: string
          formula?: string
          id?: string
          individual_rolls?: Json | null
          modifier?: number
          raw_result?: number
          roll_type?: string
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dice_logs_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          category: string
          cost: string | null
          created_at: string
          damage: string | null
          defense: number | null
          description: string | null
          id: string
          name: string
          properties: Json | null
          range_value: string | null
          source_page: number | null
          type: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          category: string
          cost?: string | null
          created_at?: string
          damage?: string | null
          defense?: number | null
          description?: string | null
          id?: string
          name: string
          properties?: Json | null
          range_value?: string | null
          source_page?: number | null
          type?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          category?: string
          cost?: string | null
          created_at?: string
          damage?: string | null
          defense?: number | null
          description?: string | null
          id?: string
          name?: string
          properties?: Json | null
          range_value?: string | null
          source_page?: number | null
          type?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      nimble_ruleset: {
        Row: {
          classes: Json
          created_at: string
          dice_system: Json
          id: string
          skills: Json
          stats: Json
          updated_at: string
          version: string
        }
        Insert: {
          classes?: Json
          created_at?: string
          dice_system?: Json
          id?: string
          skills?: Json
          stats?: Json
          updated_at?: string
          version?: string
        }
        Update: {
          classes?: Json
          created_at?: string
          dice_system?: Json
          id?: string
          skills?: Json
          stats?: Json
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      rules: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          name: string
          source_page: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          name: string
          source_page?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          source_page?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      spells: {
        Row: {
          created_at: string
          damage: string | null
          description: string
          duration: string | null
          element: string
          id: string
          name: string
          properties: Json | null
          range_value: string | null
          source_page: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          damage?: string | null
          description: string
          duration?: string | null
          element: string
          id?: string
          name: string
          properties?: Json | null
          range_value?: string | null
          source_page?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          damage?: string | null
          description?: string
          duration?: string | null
          element?: string
          id?: string
          name?: string
          properties?: Json | null
          range_value?: string | null
          source_page?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      subclasses: {
        Row: {
          class_id: string
          complexity: number
          created_at: string
          description: string
          id: string
          name: string
          source_page: number | null
          updated_at: string
        }
        Insert: {
          class_id: string
          complexity?: number
          created_at?: string
          description: string
          id?: string
          name: string
          source_page?: number | null
          updated_at?: string
        }
        Update: {
          class_id?: string
          complexity?: number
          created_at?: string
          description?: string
          id?: string
          name?: string
          source_page?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subclasses_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      ui_state: {
        Row: {
          card_id: string
          character_id: string
          created_at: string
          height: number | null
          id: string
          updated_at: string
          width: number | null
        }
        Insert: {
          card_id: string
          character_id: string
          created_at?: string
          height?: number | null
          id?: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          card_id?: string
          character_id?: string
          created_at?: string
          height?: number | null
          id?: string
          updated_at?: string
          width?: number | null
        }
        Relationships: []
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
