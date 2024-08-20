export default interface DashboardType {
  userCount: number;
  bookCount: number;
  empruntCount: number;
  sanctionCount: number;
  empruntStats: {
    month: string;
    count: number;
  }[];
  topExemplaires: {
    isbn: string;
    count: number;
    titre: string | null;
    cote: string | null;
  }[];
}
