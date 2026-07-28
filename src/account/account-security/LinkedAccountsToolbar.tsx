import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PaginationToggleTemplateProps } from "../../shared/@patternfly/react-core";
import {
  Pagination,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "../../shared/@patternfly/react-core";

type LinkedAccountsToolbarProps = {
  id: string;
  onFilter: (nameFilter: string) => void;
  count: number;
  first: number;
  max: number;
  onNextClick: (page: number) => void;
  onPreviousClick: (page: number) => void;
  onPerPageSelect: (first: number, max: number) => void;
  hasNext: boolean;
  ariaLabel: string;
};

export const LinkedAccountsToolbar = ({
  id,
  count,
  first,
  max,
  onNextClick,
  onPreviousClick,
  onPerPageSelect,
  onFilter,
  hasNext,
  ariaLabel,
}: LinkedAccountsToolbarProps) => {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState("");

  const applyFilter = (value: string) => {
    const normalizedValue = value.trim();
    setNameFilter(normalizedValue);
    onFilter(normalizedValue);
  };

  const page = Math.round(first / max) + 1;
  return (
    <Toolbar
      id={`${id}-toolbar`}
      aria-label={ariaLabel}
      className="cm-account-list-toolbar"
    >
      <ToolbarContent>
        <ToolbarItem>
          <SearchInput
            className="cm-account-search"
            searchInputId={`${id}-filter`}
            name="name"
            placeholder={t("filterByName")}
            aria-label={t("filterByName")}
            submitSearchButtonLabel={t("filterByName")}
            value={nameFilter}
            onChange={(_, value) => {
              setNameFilter(value);
            }}
            onSearch={() => applyFilter(nameFilter)}
            onClear={() => {
              setNameFilter("");
              onFilter("");
            }}
          />
        </ToolbarItem>
        <ToolbarItem variant="pagination">
          <Pagination
            isCompact
            perPageOptions={[
              { title: "5", value: 5 },
              { title: "10", value: 10 },
              { title: "20", value: 20 },
            ]}
            toggleTemplate={({
              firstIndex,
              lastIndex,
            }: PaginationToggleTemplateProps) => (
              <span>
                {firstIndex} - {lastIndex}
              </span>
            )}
            itemCount={count + (page - 1) * max + (hasNext ? 1 : 0)}
            page={page}
            perPage={max}
            onNextClick={(_, p) => onNextClick((p - 1) * max)}
            onPreviousClick={(_, p) => onPreviousClick((p - 1) * max)}
            onPerPageSelect={(_, m, f) => onPerPageSelect(f - 1, m)}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
