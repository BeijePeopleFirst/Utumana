import { FilterParams } from "./filterParams";
import { params } from "./searchParams";

export interface CompleteParams extends params, FilterParams{
    page?: number;
    size?: number;
    address_name?: string;
}
