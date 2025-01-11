export interface ArrowBackProps {
  iSize: number;
}

export interface ClubData {
  logo: string;
  name: string;
}

export interface Match {
  ma_no: number;
  competition: {
    cp_no: number;
    season: number;
    type: string;
    name: string;
    level: string;
    cdg: {
      cg_no: number;
      name: string;
      external_updated_at: string;
    };
    external_updated_at: string;
  };
  phase: {
    number: number;
    type: string;
    name: string;
    external_updated_at: string;
  };
  poule: {
    stage_number: number;
    name: string;
    external_updated_at: string;
    poule_unique: boolean;
    at_least_one_match_resultat: boolean;
  };
  poule_journee: {
    number: number;
    name: string;
    external_updated_at: string;
  };
  home: {
    club: {
      cl_no: number;
      logo: string;
      external_updated_at: string;
    };
    category_code: string;
    number: number;
    code: number;
    short_name: string;
    short_name_ligue: string;
    short_name_federation: string;
    type: string;
    external_updated_at: string;
    category_label: string;
    category_gender: string;
    engagements: Array<{
      competition: {
        cp_no: number;
        season: number;
        type: string;
        name: string;
        level: string;
        cdg: {
          cg_no: number;
          name: string;
          external_updated_at: string;
        };
        external_updated_at: string;
      };
    }>;
  };
  away: {
    club: {
      cl_no: number;
      logo: string;
      external_updated_at: string;
    };
    category_code: string;
    number: number;
    code: number;
    short_name: string;
    short_name_ligue: string;
    short_name_federation: string;
    type: string;
    external_updated_at: string;
    category_label: string;
    category_gender: string;
    engagements: Array<{
      competition: {
        cp_no: number;
        season: number;
        type: string;
        name: string;
        level: string;
        cdg: {
          cg_no: number;
          name: string;
          external_updated_at: string;
        };
        external_updated_at: string;
      };
    }>;
  };
  terrain: {
    te_no: number;
    name: string;
    zip_code: string;
    city: string;
    libelle_surface: string;
    address: string;
    external_updated_at: string;
  };
  date: string;
  time: string;
  status: string;
  is_overtime: string;
  seems_postponed: string;
  home_score: number | null;  // Score de l'équipe à domicile
  away_score: number | null;  // Score de l'équipe extérieure
  home_resu: string;  // Résultat pour l'équipe à domicile
  away_resu: string;  // Résultat pour l'équipe extérieure
  home_but_contre: number;
  away_but_contre: number;
  match_membres: Array<{
    mm_no: number;
    in_no: number;
    po_cod: string;
    prenom: string;
    nom: string;
    label_position: string;
    position_ordre: number;
    external_updated_at: string;
  }>;
  match_feuille: string;  // URL vers la feuille de match
}

export interface TousLesResultatsProps {
  matches: Match[]; 
}

export interface MatchAVenir {
  ma_no: number;
  date: string;
  home_score: number;
  away_score: number;
  time: number;
  home: {
    short_name: string;
    club: {
      logo: string;
    };
  };
  away: {
    short_name: string;
    club: {
      logo: string;
    };
  };
}