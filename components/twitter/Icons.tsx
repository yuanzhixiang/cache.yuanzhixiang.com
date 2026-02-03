import React from "react";

export const XLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </g>
  </svg>
);

export const HomeIcon = ({
  className,
  active,
}: {
  className?: string;
  active?: boolean;
}) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      {active ? (
        <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path>
      ) : (
        <path d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"></path>
      )}
    </g>
  </svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.73 3.815-1.945 5.232l4.959 4.959-1.414 1.414-4.959-4.959C14.065 18.27 12.236 19 10.25 19c-4.694 0-8.5-3.806-8.5-8.5z"></path>
    </g>
  </svg>
);

export const NotificationIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M21.697 16.468c-.02-.016-2.14-1.64-2.103-6.03.02-2.532-.812-4.982-2.347-6.888-1.515-1.882-3.664-2.96-5.996-2.96H10.59c-2.34 0-4.516 1.09-6.04 3.003C3.01 5.56 2.188 8.01 2.193 10.45c.015 2.21-1.07 1.636-2.104 1.97-.247.08-.42.28-.47.53-.045.26.082.52.32.66l2.97 1.73c.06.03.12.05.18.06l-.01 1.075c0 .28.22.5.5.5h17.96c.27 0 .48-.2.5-.48l-.01-1.07c.06-.01.12-.03.18-.06l2.95-1.72c.23-.13.36-.39.32-.65-.05-.24-.23-.45-.48-.53zM11.23 21.01c-.13.24-.37.39-.64.39H8.76c-.28 0-.52-.16-.64-.4l-1.35-2.51H2.57l3.96-2.3c.18-.11.29-.3.29-.51l.01-1.08c-.01-4.08 3.31-7.4 7.42-7.4s7.43 3.32 7.42 7.4l.01 1.08c0 .2.1.39.28.5l3.99 2.32h-4.32l-1.37 2.51z"></path>
      <path d="M10.25 21.5c-2.07 0-3.75-1.68-3.75-3.75 0-.28.22-.5.5-.5s.5.22.5.5c0 1.52 1.23 2.75 2.75 2.75s2.75-1.23 2.75-2.75c0-.28.22-.5.5-.5s.5.22.5.5c0 2.07-1.68 3.75-3.75 3.75z"></path>
    </g>
  </svg>
);

export const MailIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
    </g>
  </svg>
);

export const GrokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path
        d="M2 2h2v20H2zM20 2h2v20h-2zM5 2h2v14H5zM17 2h2v14h-2zM8 2h8v11H8z"
        opacity="0.7"
      ></path>
      {/* Fallback path for Grok as exact one is complex */}
      <path
        d="M2.25 2.25h19.5v19.5H2.25z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      ></path>
    </g>
  </svg>
);

export const PeopleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
    </g>
  </svg>
);

export const ProfileIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M5.651 19h12.698c-.337-1.8-1.596-3.218-3.357-3.801-1.15-.382-2.148-.289-2.992.277-.844-.566-1.842-.659-2.992-.277C7.247 15.782 5.988 17.2 5.651 19zM12 11.25c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm7.772 8.52c-.177-3.006-2.203-5.465-5.02-6.425 1.205-.838 2-2.222 2-3.845 0-2.481-2.019-4.5-4.5-4.5s-4.5 2.019-4.5 4.5c0 1.623.795 3.007 2 3.845-2.817.96-4.843 3.419-5.02 6.425-.034.577.426 1.055 1.004 1.055h13.032c.578 0 1.038-.478 1.004-1.055z"></path>
    </g>
  </svg>
);

export const MoreIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25zm0 17.5c-4.27 0-7.75-3.48-7.75-7.75s3.48-7.75 7.75-7.75 7.75 3.48 7.75 7.75-3.48 7.75-7.75 7.75zm-3.5-6.5c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm3.5 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm3.5 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"></path>
    </g>
  </svg>
);

export const PremiumIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </g>
  </svg>
);

export const ArticleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5V4.5zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5V4.5c0-.28-.22-.5-.5-.5h-13zM7 8h10v2H7V8zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"></path>
    </g>
  </svg>
);

export const MediaIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
    </g>
  </svg>
);

export const GifIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5h-13zM19 10.5v3c0 .828-.672 1.5-1.5 1.5h-1.5v1h-2v-1h-1.5v-5h1.5v1h2v-1h1.5zm-3.5 3h1.5v-1h-1.5v1zm-4-1.5v-1.5h-1.5v5h1.5v-3.5zm-5 0v-1.5h-1.5v5h1.5v-1h2v-1h-2v-1.5h2v-1h-2z"></path>
    </g>
  </svg>
);

export const PollIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M6 5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zM4 11.5c0-.828.672-1.5 1.5-1.5h13c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-13c-.828 0-1.5-.672-1.5-1.5zm0 5c0-.828.672-1.5 1.5-1.5h13c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-13c-.828 0-1.5-.672-1.5-1.5z"></path>
    </g>
  </svg>
);

export const EmojiIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-4.224-1.225-5.247-2.998-.31-.538-.124-1.226.413-1.536.537-.31 1.225-.124 1.536.413C9.366 12.986 10.603 13.5 12 13.5s2.634-.514 3.298-1.621c.311-.537.999-.723 1.536-.413.537.31.723.998.413 1.536C16.224 14.775 14.224 16 12 16zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
    </g>
  </svg>
);

export const ScheduleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M6 3V2h2v1H6zm10 0V2h2v1h-2zM3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v1.5h14V5.5c0-.276-.224-.5-.5-.5h-13zM19 9H5v9.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5V9zM9.5 15h-2v-2h2v2zm2.5-2h2v2h-2v-2zm-2.5 4.5h-2v-2h2v2zm5-2v2h-2v-2h2z"></path>
    </g>
  </svg>
);

export const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M12 2C7.53 2 3.9 5.63 3.9 10.1c0 6.06 7.15 11.43 7.45 11.66.18.14.41.22.65.22.23 0 .47-.07.64-.22.3-.23 7.46-5.6 7.46-11.66C20.1 5.63 16.47 2 12 2zm0 17.65c-2.13-1.89-6.1-5.78-6.1-9.55 0-3.37 2.73-6.1 6.1-6.1s6.1 2.73 6.1 6.1c0 3.77-3.97 7.66-6.1 9.55zM12 7c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"></path>
    </g>
  </svg>
);

/* UI Icons */
export const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
    </g>
  </svg>
);

export const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M5.5 4v12.5h-2V4c0-.55.45-1 1-1h10v2h-9zm14 2h-8c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1zm-1 12h-6V8h6v10z"></path>
    </g>
  </svg>
);

export const FileIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path>
    </g>
  </svg>
);

export const WaveIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M3 13.5l3-3 4 4 4.5-5 3.5 3V5h2v14H3v-5.5z"></path>
    </g>
  </svg>
);

/* Action Icons */
export const ReplyIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
    </g>
  </svg>
);

export const RepostIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
    </g>
  </svg>
);

export const LikeIcon = ({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={filled ? 0 : 2}
    style={filled ? {} : { stroke: "currentColor" }}
  >
    <g>
      {filled ? (
        <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.505.3-.505-.3c-4.378-2.55-7.028-5.19-8.379-7.67-1.06-1.94-1.464-4.13-1.105-5.9.699-3.45 3.513-5.78 6.64-5.28 2.087.34 3.733 1.6 4.349 2.36.616-.76 2.262-2.02 4.349-2.36 3.125-.5 5.941 1.83 6.639 5.28.36 1.77-.044 3.96-1.104 5.9z"></path>
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        />
      )}
    </g>
  </svg>
);

export const ViewIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
    </g>
  </svg>
);

export const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
    </g>
  </svg>
);

export const ShareIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <g>
      <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.12 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
    </g>
  </svg>
);
