// @flow
import * as React from 'react';
import { Trans } from '@lingui/macro';
import { Column, Line, Spacer } from '../UI/Grid';
import Add from '../UI/CustomSvgIcons/Add';
import Text from '../UI/Text';
import { useResponsiveWindowSize } from '../UI/Responsive/ResponsiveWindowMeasurer';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { shouldValidate } from '../UI/KeyboardShortcuts/InteractionKeys';
import classes from './EmptyAndStartingPointProjects.module.css';
import { getItemsColumns } from './NewProjectSetupDialog';
import { type ExampleShortHeader } from '../Utils/GDevelopServices/Example';

// To remove once all starting points are properly tagged.
const isStartingPointButNotTaggedAsSuchYet = (
  exampleShortHeader: ExampleShortHeader
): boolean => {
  return (
    exampleShortHeader.slug.startsWith('starting-') &&
    !exampleShortHeader.slug.includes('-pixel')
  );
};

export const isStartingPointExampleShortHeader = (
  exampleShortHeader: ExampleShortHeader
): boolean => {
  return (
    exampleShortHeader.tags.includes('Starting point') ||
    isStartingPointButNotTaggedAsSuchYet(exampleShortHeader)
  );
};

export const isLinkedToStartingPointExampleShortHeader = (
  allExampleShortHeaders: Array<ExampleShortHeader>,
  exampleShortHeader: ExampleShortHeader
): boolean => {
  const startingPoints = allExampleShortHeaders.filter(
    isStartingPointExampleShortHeader
  );
  return startingPoints.some(startingPoint =>
    startingPoint.linkedExampleShortHeaders
      ? startingPoint.linkedExampleShortHeaders.some(
          linkedExampleShortHeader =>
            linkedExampleShortHeader.slug === exampleShortHeader.slug
        )
      : false
  );
};

const ITEMS_SPACING = 5;

type EmptyProjectTileProps = {|
  onSelectEmptyProject: () => void,
  disabled?: boolean,
  /** Props needed so that GridList component can adjust tile size */
  style?: any,
  cols?: number,
|};

// The design of this tile copies the ones in ShopTiles.js
const EmptyProjectTile = ({
  onSelectEmptyProject,
  disabled,
  style,
  cols,
}: EmptyProjectTileProps) => {
  const { isMobile } = useResponsiveWindowSize();
  return (
    <GridListTile style={style} cols={cols}>
      <div className={classes.container}>
        <div
          className={classes.emptyProject}
          onClick={disabled ? undefined : onSelectEmptyProject}
          tabIndex={0}
          onKeyPress={(event: SyntheticKeyboardEvent<HTMLLIElement>): void => {
            if (shouldValidate(event) && !disabled) {
              onSelectEmptyProject();
            }
          }}
          id="empty-project-tile"
          style={{ minHeight: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Column alignItems="center" justifyContent="center" expand>
            <Add style={{ fontSize: 48 }} />
            <Text align="center" noMargin size="block-title">
              <Trans>Empty project</Trans>
            </Text>
          </Column>
        </div>
        <Column>
          {isMobile && <Spacer />}
          <Line justifyContent="flex-start" noMargin>
            {/* Add a hidden text to match the height of the other tiles on the row */}
            <Text size="body2" hidden noMargin={isMobile}>
              <Trans>Empty project</Trans>
            </Text>
          </Line>
        </Column>
      </div>
    </GridListTile>
  );
};

type Props = {|
  onSelectEmptyProject: () => void,
  disabled?: boolean,
|};

const EmptyAndStartingPointProjects = ({
  onSelectEmptyProject,
  disabled,
}: Props): React.Node => {
  const { windowSize, isLandscape } = useResponsiveWindowSize();
  const columnsCount = getItemsColumns(windowSize, isLandscape);

  return (
    <GridList
      cols={columnsCount}
      style={{
        width: `calc(100% + ${2 * ITEMS_SPACING}px)`,
        overflow: 'unset',
      }}
      cellHeight="auto"
      spacing={ITEMS_SPACING * 2}
    >
      <EmptyProjectTile
        onSelectEmptyProject={onSelectEmptyProject}
        disabled={disabled}
        cols={columnsCount}
      />
    </GridList>
  );
};

export default EmptyAndStartingPointProjects;