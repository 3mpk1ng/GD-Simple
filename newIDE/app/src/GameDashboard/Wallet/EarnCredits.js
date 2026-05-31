// @flow
import * as React from 'react';
import { Trans } from '@lingui/macro';
import Text from '../../UI/Text';
import {
  ColumnStackLayout,
  LineStackLayout,
  ResponsiveLineStackLayout,
} from '../../UI/Layout';
import {
  type Badge,
  type Achievement,
} from '../../Utils/GDevelopServices/Badge';
import { Column } from '../../UI/Grid';
import Window from '../../Utils/Window';
import Coin from '../../Credits/Icons/Coin';
import { selectMessageByLocale } from '../../Utils/i18n/MessageByLocale';
import { I18n } from '@lingui/react';
import { useResponsiveWindowSize } from '../../UI/Responsive/ResponsiveWindowMeasurer';
import FlatButton from '../../UI/FlatButton';
import MultipleCoins from '../../Credits/Icons/MultipleCoins';

type BadgeInfo = {|
  id: string,
  label: React.Node,
  linkUrl: string,
  hasThisBadge?: boolean,
  type: 'badge',
|};

const styles = {
  widgetContainer: {
    maxWidth: 1800,
  },
  badgeContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  badgeCoinIcon: {
    width: 16,
    height: 16,
  },
  itemPlaceholder: {
    display: 'flex',
    flex: 1,
  },
};

const allBadgesInfo: BadgeInfo[] = [
  {
    id: 'github-star',
    label: 'Star GDevelop',
    linkUrl: 'https://github.com/4ian/GDevelop',
    type: 'badge',
  },
  {
    id: 'tiktok-follow',
    label: <Trans>Follow</Trans>,
    linkUrl: 'https://www.tiktok.com/@gdevelop',
    type: 'badge',
  },
  {
    id: 'twitter-follow',
    label: <Trans>Follow</Trans>,
    linkUrl: 'https://x.com/GDevelopApp',
    type: 'badge',
  },
  {
    id: 'youtube-subscription',
    label: <Trans>Subscribe</Trans>,
    linkUrl: 'https://youtube.com/GDevelopApp',
    type: 'badge',
  },
];

const getAllBadgesWithOwnedStatus = (badges: ?Array<Badge>): BadgeInfo[] => {
  return allBadgesInfo.map(badgeInfo => ({
    ...badgeInfo,
    hasThisBadge: hasBadge(badges, badgeInfo.id),
  }));
};

const getAchievement = (achievements: ?Array<Achievement>, id: string) =>
  achievements && achievements.find(achievement => achievement.id === id);

const hasBadge = (badges: ?Array<Badge>, achievementId: string) =>
  !!badges && badges.some(badge => badge.achievementId === achievementId);

export const hasMissingBadges = (
  badges: ?Array<Badge>,
  achievements: ?Array<Achievement>
): boolean =>
  !badges ||
  !achievements ||
  achievements.some(achievement => !hasBadge(badges, achievement.id));

const BadgeItem = ({
  achievement,
  hasThisBadge,
  linkUrl,
  onOpenProfile,
}: {|
  achievement: ?Achievement,
  hasThisBadge: boolean,
  buttonLabel: React.Node,
  linkUrl: string,
  onOpenProfile: () => void,
|}) => {
  const [hasBeenClicked, setHasBeenClicked] = React.useState(false);
  const onClick = React.useCallback(
    () => {
      if (hasBeenClicked) {
        onOpenProfile();
      } else {
        Window.openExternalURL(linkUrl);
        setHasBeenClicked(true);
      }
    },
    [hasBeenClicked, linkUrl, onOpenProfile]
  );

  return (
    <I18n>
      {({ i18n }) => (
        <LineStackLayout expand alignItems="center" noMargin>
          <div style={styles.badgeContainer}>
            {hasThisBadge ? (
              <img
                src={
                  (achievement && achievement.iconUrl) ||
                  'res/badges/empty-badge.svg'
                }
                alt="Badge icon"
                style={styles.badgeImage}
              />
            ) : (
              <MultipleCoins style={styles.badgeImage} />
            )}
          </div>
          <Column noMargin expand>
            {hasThisBadge ? (
              <Text size="body" noMargin>
                <b>
                  <Trans>
                    {(achievement &&
                      selectMessageByLocale(i18n, achievement.nameByLocale)) ||
                      '-'}
                  </Trans>
                </b>
              </Text>
            ) : (
              <Text size="body" noMargin color="secondary">
                <Trans>
                  {(achievement &&
                    selectMessageByLocale(
                      i18n,
                      achievement.shortDescriptionByLocale
                    )) ||
                    '-'}
                </Trans>
              </Text>
            )}
          </Column>
          <FlatButton
            leftIcon={
              hasThisBadge ? null : <Coin style={styles.badgeCoinIcon} />
            }
            label={
              hasThisBadge ? (
                <Trans>Owned</Trans>
              ) : !hasBeenClicked ? (
                <Trans>
                  Earn{' '}
                  {achievement ? achievement.rewardValueInCredits : 'credits'}
                </Trans>
              ) : (
                <Trans>Claim credits</Trans>
              )
            }
            onClick={onClick}
            disabled={hasThisBadge}
            primary
          />
        </LineStackLayout>
      )}
    </I18n>
  );
};

type Props = {|
  achievements: ?Array<Achievement>,
  badges: ?Array<Badge>,
  onOpenProfile: () => void,
  showRandomItem?: boolean,
  showAllItems?: boolean,
|};

export const EarnCredits = ({
  achievements,
  badges,
  onOpenProfile,
  showRandomItem,
  showAllItems,
}: Props): React.MixedElement => {
  const { isMobile, windowSize } = useResponsiveWindowSize();
  const isExtraLargeScreen = windowSize === 'xlarge';

  const allBadgesWithOwnedStatus = React.useMemo(
    () => getAllBadgesWithOwnedStatus(badges),
    [badges]
  );

  const missingBadges = React.useMemo(
    () => allBadgesWithOwnedStatus.filter(badge => !badge.hasThisBadge),
    [allBadgesWithOwnedStatus]
  );

  const badgesToShow: Array<BadgeInfo> = React.useMemo(
    () => {
      if (showRandomItem || (isMobile && !showAllItems)) {
        if (missingBadges.length === 0) {
          const randomIndex = Math.floor(
            Math.random() * allBadgesWithOwnedStatus.length
          );
          return [allBadgesWithOwnedStatus[randomIndex]];
        }
        const randomIndex = Math.floor(Math.random() * missingBadges.length);
        return [missingBadges[randomIndex]];
      }

      return allBadgesWithOwnedStatus;
    },
    [
      allBadgesWithOwnedStatus,
      missingBadges,
      showRandomItem,
      showAllItems,
      isMobile,
    ]
  );

  const onlyOneItemDisplayed = badgesToShow.length === 1;
  const itemsPerRow = onlyOneItemDisplayed ? 1 : isExtraLargeScreen ? 3 : 2;

  const itemsSlicedInArrays: BadgeInfo[][] = React.useMemo(
    () => {
      const slicedItems: BadgeInfo[][] = [];
      for (let i = 0; i < badgesToShow.length; i += itemsPerRow) {
        slicedItems.push(badgesToShow.slice(i, i + itemsPerRow));
      }
      return slicedItems;
    },
    [badgesToShow, itemsPerRow]
  );

  return (
    <div style={styles.widgetContainer}>
      <ColumnStackLayout noMargin expand>
        {itemsSlicedInArrays.map((items, index) => (
          <ResponsiveLineStackLayout
            noMargin
            expand={onlyOneItemDisplayed}
            key={`item-line-${index}`}
          >
            {items.map(item => (
              <BadgeItem
                key={item.id}
                achievement={getAchievement(achievements, item.id)}
                hasThisBadge={!!item.hasThisBadge}
                buttonLabel={item.label}
                linkUrl={item.linkUrl}
                onOpenProfile={onOpenProfile}
              />
            ))}
            {items.length < itemsPerRow &&
              !onlyOneItemDisplayed &&
              Array.from(
                { length: itemsPerRow - items.length },
                (_, i) => i
              ).map(i => (
                <div key={`filler-${i}`} style={styles.itemPlaceholder} />
              ))}
          </ResponsiveLineStackLayout>
        ))}
      </ColumnStackLayout>
    </div>
  );
};
