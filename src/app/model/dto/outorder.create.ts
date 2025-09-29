export interface IOutorderCreate {
  readonly subscriptionType?: string;
  readonly tariff_id?: number;
  readonly code: string;
  readonly q: number;
  readonly lang_slug: string;
}
