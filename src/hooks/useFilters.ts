"use client";
import { useRouter } from "next/navigation";
import { useTransition, useRef } from "react";

export enum FilterType {
  SEARCH = "search",
  STRING_FILTER = "stringFilter",
}

type FilterableParameterSetType<N extends FilterType = FilterType> = {
  readonly search: string | null;
  readonly stringFilter: (string | null)[] | null;
}[N];

type FilterableParameterType<N extends FilterType = FilterType> = {
  readonly search: string | null;
  readonly stringFilter: string[] | null;
}[N];

const EXCLUDE = "EXCLUDE" as const;
type EXCLUDE = typeof EXCLUDE;

type FilterConfig<N extends FilterType> = {
  readonly name: N;
  readonly defaultValue: FilterableParameterType<N>;
  readonly encodeUriComponent: (value: FilterableParameterType<N>) => string | number | EXCLUDE;
  readonly preprocess?: (setValue: FilterableParameterSetType<N>) => FilterableParameterType<N>;
};

const FilterConfigs: { [key in FilterType]: Omit<FilterConfig<key>, "name"> } = {
  [FilterType.SEARCH]: {
    defaultValue: null,
    encodeUriComponent: v => (typeof v === "string" && v.length !== 0 ? v : EXCLUDE),
  },
  [FilterType.STRING_FILTER]: {
    defaultValue: null,
    encodeUriComponent: v => (Array.isArray(v) && v.length !== 0 ? v.join(",") : EXCLUDE),
    preprocess: value => (value !== null ? value.filter((v): v is string => v !== null && v.length !== 0) : value),
  },
};

type Filter<N extends FilterType> = {
  readonly initialValue?: FilterableParameterType<N>;
  readonly filterType: N;
};

type FiltersConfig<K extends string, NT extends { [key in K]: FilterType }> = { [key in K]: Filter<NT[key]> };
type Filters<K extends string, NT extends { [key in K]: FilterType }> = {
  [key in K]: FilterableParameterType<NT[key]>;
};

const getInitialFilters = <K extends string, NT extends { [key in K]: FilterType }>(configs: FiltersConfig<K, NT>) => {
  const filters: Filters<K, NT> = {} as Filters<K, NT>;
  for (const key in configs) {
    const config = configs[key];
    filters[key] = config.initialValue ?? FilterConfigs[config.filterType].defaultValue;
  }
  return filters;
};

const encodeFiltersInQuery = <K extends string, NT extends { [key in K]: FilterType }>(
  filters: Filters<K, NT>,
  configs: FiltersConfig<K, NT>,
) => {
  const params = new URLSearchParams();
  for (const key in filters) {
    const value = filters[key];
    const config = FilterConfigs[configs[key].filterType];
    const encoded = config.encodeUriComponent(value);
    if (encoded !== EXCLUDE) {
      params.set(key, encodeURIComponent(encoded));
    }
  }
  return params;
};

type UseFiltersOptions<K extends string, NT extends { [key in K]: FilterType }> = {
  readonly onChange?: (filters: Filters<K, NT>, query: string) => void;
};

type SetFilter<K extends string, NT extends { [key in K]: FilterType }> = {
  <Ki extends K>(key: Ki, value: Filters<K, NT>[Ki]): void;
};

export const useFilters = <K extends string, NT extends { [key in K]: FilterType }>(
  configs: FiltersConfig<K, NT>,
  options?: UseFiltersOptions<K, NT>,
): [SetFilter<K, NT>] => {
  const lastFilters = useRef<Filters<K, NT>>(getInitialFilters(configs));

  const setFilter = <Ki extends K>(key: Ki, value: Filters<K, NT>[Ki]) => {
    lastFilters.current = { ...lastFilters.current, [key]: value };
    options?.onChange?.(lastFilters.current, encodeFiltersInQuery(lastFilters.current, configs).toString());
  };
  return [setFilter];
};

type UseFiltersRoutingOptions<K extends string, NT extends { [key in K]: FilterType }> = Omit<
  UseFiltersOptions<K, NT>,
  "onChange"
> & {
  readonly basePath: string;
};

export const useFiltersRouting = <K extends string, NT extends { [key in K]: FilterType }>(
  configs: FiltersConfig<K, NT>,
  options: UseFiltersRoutingOptions<K, NT>,
): [boolean, SetFilter<K, NT>] => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [setFilter] = useFilters<K, NT>(configs, {
    ...options,
    onChange: (filters, query) => {
      startTransition(() => {
        if (query.length === 0) {
          router.push(options.basePath);
        } else {
          router.push(`${options.basePath}?${query}`);
        }
      });
    },
  });
  return [isPending, setFilter];
};
