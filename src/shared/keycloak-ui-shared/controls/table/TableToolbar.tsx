import {
  Divider,
  InputGroup,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "../../../@patternfly/react-core";
import type { KeyboardEvent, PropsWithChildren, ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type TableToolbarProps = {
  toolbarItem?: ReactNode;
  subToolbar?: ReactNode;
  toolbarItemFooter?: ReactNode;
  searchTypeComponent?: ReactNode;
  inputGroupName?: string;
  inputGroupPlaceholder?: string;
  inputGroupOnEnter?: (value: string) => void;
};

export const TableToolbar = ({
  toolbarItem,
  subToolbar,
  toolbarItemFooter,
  children,
  searchTypeComponent,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnEnter,
}: PropsWithChildren<TableToolbarProps>) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>("");

  const onSearch = (searchValue: string) => {
    setSearchValue(searchValue.trim());
    inputGroupOnEnter?.(searchValue.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchValue);
    }
  };

  return (
    <>
      <Toolbar
        data-testid="table-toolbar"
        aria-label={inputGroupPlaceholder || t("search")}
      >
        <ToolbarContent>
          {inputGroupName && (
            <ToolbarItem>
              <InputGroup data-testid={inputGroupName}>
                {searchTypeComponent}
                {inputGroupPlaceholder && (
                  <SearchInput
                    className="cm-account-search"
                    data-testid="table-search-input"
                    placeholder={inputGroupPlaceholder}
                    aria-label={t("search")}
                    value={searchValue}
                    onChange={(_, value) => {
                      setSearchValue(value);
                    }}
                    onSearch={() => onSearch(searchValue)}
                    onKeyDown={handleKeyDown}
                    onClear={() => onSearch("")}
                  />
                )}
              </InputGroup>
            </ToolbarItem>
          )}
          {toolbarItem}
        </ToolbarContent>
      </Toolbar>
      {subToolbar && (
        <Toolbar aria-label={t("actions")}>
          <ToolbarContent>{subToolbar}</ToolbarContent>
        </Toolbar>
      )}
      <Divider />
      {children}
      {toolbarItemFooter ? (
        <Toolbar aria-label={t("pagination")}>{toolbarItemFooter}</Toolbar>
      ) : null}
    </>
  );
};
