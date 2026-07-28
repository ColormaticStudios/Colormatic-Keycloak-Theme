import {
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
} from "../../../shared/@patternfly/react-core";

type EmptyRowProps = {
  message: string;
};

export const EmptyRow = ({ message, ...props }: EmptyRowProps) => {
  return (
    <DataListItem className="cm-account-empty-row">
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="0" {...props}>
              {message}
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );
};
