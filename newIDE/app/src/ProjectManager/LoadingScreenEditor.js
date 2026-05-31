// @flow
import { t, Trans } from '@lingui/macro';
import * as React from 'react';
import Checkbox from '../UI/Checkbox';
import ColorField from '../UI/ColorField';
import { I18n } from '@lingui/react';
import { Line, Column } from '../UI/Grid';
import SemiControlledTextField from '../UI/SemiControlledTextField';
import { ColumnStackLayout, ResponsiveLineStackLayout } from '../UI/Layout';
import {
  hexNumberToRGBString,
  rgbStringToHexNumber,
} from '../Utils/ColorTransformer';
import useForceUpdate from '../Utils/UseForceUpdate';
import ResourceSelectorWithThumbnail from '../ResourcesList/ResourceSelectorWithThumbnail';
import { type ResourceManagementProps } from '../ResourcesList/ResourceSource';
import SelectField from '../UI/SelectField';
import SelectOption from '../UI/SelectOption';
import Text from '../UI/Text';
import AlertMessage from '../UI/AlertMessage';
import AuthenticatedUserContext from '../Profile/AuthenticatedUserContext';
import { ProjectScopedContainersAccessor } from '../InstructionOrExpression/EventsScope';

type Props = {|
  loadingScreen: gdLoadingScreen,
  watermark: gdWatermark,
  onLoadingScreenUpdated: () => void,
  onChangeSubscription: () => Promise<void> | void,

  // For resources:
  project: gdProject,
  resourceManagementProps: ResourceManagementProps,
  projectScopedContainersAccessor: ProjectScopedContainersAccessor,
|};

const watermarkPlacementOptions = [
  { value: 'top', label: t`Top` },
  { value: 'top-left', label: t`Top left corner` },
  { value: 'top-right', label: t`Top right corner` },
  { value: 'bottom', label: t`Bottom` },
  { value: 'bottom-left', label: t`Bottom left corner` },
  { value: 'bottom-right', label: t`Bottom right corner` },
];

export const LoadingScreenEditor = ({
  loadingScreen,
  watermark,
  onLoadingScreenUpdated,
  project,
  resourceManagementProps,
  projectScopedContainersAccessor,
}: Props): React.Node => {
  const forceUpdate = useForceUpdate();

  // Force this to true to bypass any remaining UI logic that depends on it
  const hasValidSubscription = true;

  const onUpdate = () => {
    forceUpdate();
    onLoadingScreenUpdated();
  };

  return (
    <I18n>
      {({ i18n }) => (
        <ColumnStackLayout expand noMargin>
          <Text size="section-title">
            <Trans>Branding</Trans>
          </Text>
          <ColumnStackLayout noMargin>
            <ResponsiveLineStackLayout noResponsiveLandscape noMargin>
              <Column expand noMargin justifyContent="center">
                <Checkbox
                  label={
                    <Trans>
                      Display GDevelop logo at startup (in exported game)
                    </Trans>
                  }
                  checked={loadingScreen.isGDevelopLogoShownDuringLoadingScreen()}
                  onCheck={(e, checked) => {
                    loadingScreen.showGDevelopLogoDuringLoadingScreen(checked);
                    onUpdate();
                  }}
                />
              </Column>
              <Column expand noMargin justifyContent="center">
                <SelectField
                  fullWidth
                  floatingLabelText={<Trans>GDevelop logo style</Trans>}
                  value={loadingScreen.getGDevelopLogoStyle()}
                  onChange={(e, i, newGdevelopLogoStyle: string) => {
                    loadingScreen.setGDevelopLogoStyle(newGdevelopLogoStyle);
                    onUpdate();
                  }}
                  disabled={
                    !loadingScreen.isGDevelopLogoShownDuringLoadingScreen()
                  }
                >
                  <SelectOption value="light" label={t`Light (plain)`} />
                  <SelectOption
                    value="light-colored"
                    label={t`Light (colored)`}
                  />
                  <SelectOption value="dark" label={t`Dark (plain)`} />
                  <SelectOption
                    value="dark-colored"
                    label={t`Dark (colored)`}
                  />
                </SelectField>
              </Column>
            </ResponsiveLineStackLayout>

            <ResponsiveLineStackLayout noResponsiveLandscape noMargin>
              <Column expand noMargin justifyContent="center">
                <Checkbox
                  label={
                    <Trans>
                      Display GDevelop watermark after the game is loaded (in
                      exported game)
                    </Trans>
                  }
                  checked={watermark.isGDevelopWatermarkShown()}
                  onCheck={(e, checked) => {
                    watermark.showGDevelopWatermark(checked);
                    onUpdate();
                  }}
                />
              </Column>
              <Column expand noMargin justifyContent="center">
                <SelectField
                  fullWidth
                  floatingLabelText={
                    <Trans>GDevelop watermark placement</Trans>
                  }
                  value={watermark.getPlacement()}
                  onChange={(e, i, newPlacement: string) => {
                    watermark.setPlacement(newPlacement);
                    onUpdate();
                  }}
                  disabled={!watermark.isGDevelopWatermarkShown()}
                >
                  {watermarkPlacementOptions.map(option => (
                    <SelectOption
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </SelectField>
              </Column>
            </ResponsiveLineStackLayout>
          </ColumnStackLayout>

          <Text size="section-title">
            <Trans>Loading screen</Trans>
          </Text>
          <Text size="block-title">
            <Trans>Background</Trans>
          </Text>
          <Line noMargin>
            <ResourceSelectorWithThumbnail
              floatingLabelText={<Trans>Background image</Trans>}
              project={project}
              resourceManagementProps={resourceManagementProps}
              projectScopedContainersAccessor={projectScopedContainersAccessor}
              resourceKind="image"
              resourceName={loadingScreen.getBackgroundImageResourceName()}
              defaultNewResourceName={'LoadingScreenBackground'}
              onChange={newResourceName => {
                loadingScreen.setBackgroundImageResourceName(newResourceName);
                onUpdate();
              }}
            />
          </Line>
          <ResponsiveLineStackLayout noResponsiveLandscape noMargin>
            <ColorField
              fullWidth
              floatingLabelText={<Trans>Background color</Trans>}
              disableAlpha
              color={hexNumberToRGBString(loadingScreen.getBackgroundColor())}
              onChange={newColor => {
                loadingScreen.setBackgroundColor(
                  rgbStringToHexNumber(newColor)
                );
                onUpdate();
              }}
            />
            <SemiControlledTextField
              floatingLabelText={
                <Trans>Background fade in duration (in seconds)</Trans>
              }
              step={0.1}
              fullWidth
              type="number"
              value={'' + loadingScreen.getBackgroundFadeInDuration()}
              onChange={newValue => {
                loadingScreen.setBackgroundFadeInDuration(
                  Math.max(0, parseFloat(newValue))
                );
                onUpdate();
              }}
            />
          </ResponsiveLineStackLayout>

          <Text size="block-title">
            <Trans>Progress bar</Trans>
          </Text>
          <Checkbox
            label={<Trans>Show progress bar</Trans>}
            checked={loadingScreen.getShowProgressBar()}
            onCheck={(e, checked) => {
              loadingScreen.setShowProgressBar(checked);
              onUpdate();
            }}
          />
          <ResponsiveLineStackLayout noResponsiveLandscape noMargin>
            <SemiControlledTextField
              floatingLabelText={<Trans>Progress bar minimum width</Trans>}
              fullWidth
              type="number"
              value={'' + loadingScreen.getProgressBarMinWidth()}
              onChange={newValue => {
                loadingScreen.setProgressBarMinWidth(
                  Math.max(0, parseFloat(newValue) || 0)
                );
                onUpdate();
              }}
              helperMarkdownText={i18n._(t`In pixels. 0 to ignore.`)}
            />
            <SemiControlledTextField
              floatingLabelText={<Trans>Progress bar width</Trans>}
              fullWidth
              type="number"
              value={'' + loadingScreen.getProgressBarWidthPercent()}
              onChange={newValue => {
                loadingScreen.setProgressBarWidthPercent(
                  Math.min(100, Math.max(1, parseFloat(newValue) || 0))
                );
                onUpdate();
              }}
              helperMarkdownText={i18n._(t`As a percent of the game width.`)}
            />
            <SemiControlledTextField
              floatingLabelText={<Trans>Progress bar maximum width</Trans>}
              fullWidth
              type="number"
              value={'' + loadingScreen.getProgressBarMaxWidth()}
              onChange={newValue => {
                loadingScreen.setProgressBarMaxWidth(
                  Math.max(0, parseFloat(newValue) || 0)
                );
                onUpdate();
              }}
              helperMarkdownText={i18n._(t`In pixels. 0 to ignore.`)}
            />
          </ResponsiveLineStackLayout>
          <ResponsiveLineStackLayout noResponsiveLandscape noMargin>
            <SemiControlledTextField
              floatingLabelText={<Trans>Progress bar height</Trans>}
              fullWidth
              type="number"
              value={'' + loadingScreen.getProgressBarHeight()}
              onChange={newValue => {
                loadingScreen.setProgressBarHeight(
                  Math.max(1, parseFloat(newValue) || 0)
                );
                onUpdate();
              }}
              helperMarkdownText={i18n._(t`In pixels.`)}
            />
            <ColorField
              fullWidth
              floatingLabelText={<Trans>Progress bar color</Trans>}
              disableAlpha
              color={hexNumberToRGBString(loadingScreen.getProgressBarColor())}
              onChange={newColor => {
                loadingScreen.setProgressBarColor(
                  rgbStringToHexNumber(newColor)
                );
                onUpdate();
              }}
            />
          </ResponsiveLineStackLayout>

          <Text size="block-title">
            <Trans>Duration</Trans>
          </Text>
          <SemiControlledTextField
            floatingLabelText={
              <Trans>Minimum duration of the screen (in seconds)</Trans>
            }
            step={0.1}
            fullWidth
            type="number"
            value={'' + loadingScreen.getMinDuration()}
            onChange={newValue => {
              loadingScreen.setMinDuration(
                Math.max(0, parseFloat(newValue) || 0)
              );
              onUpdate();
            }}
            helperMarkdownText={i18n._(
              t`When previewing the game in the editor, this duration is ignored.`
            )}
          />
          <ResponsiveLineStackLayout noResponsiveLandscape noMargin>
            <SemiControlledTextField
              floatingLabelText={<Trans>Fade in delay (in seconds)</Trans>}
              step={0.1}
              fullWidth
              type="number"
              value={'' + loadingScreen.getLogoAndProgressLogoFadeInDelay()}
              onChange={newValue => {
                loadingScreen.setLogoAndProgressLogoFadeInDelay(
                  Math.max(0, parseFloat(newValue) || 0)
                );
                onUpdate();
              }}
            />
            <SemiControlledTextField
              floatingLabelText={<Trans>Fade in duration (in seconds)</Trans>}
              step={0.1}
              fullWidth
              type="number"
              value={'' + loadingScreen.getLogoAndProgressFadeInDuration()}
              onChange={newValue => {
                loadingScreen.setLogoAndProgressFadeInDuration(
                  Math.max(0, parseFloat(newValue) || 0)
                );
                onUpdate();
              }}
            />
          </ResponsiveLineStackLayout>
        </ColumnStackLayout>
      )}
    </I18n>
  );
};
