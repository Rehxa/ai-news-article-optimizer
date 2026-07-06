// lib/utils/dialogConfigs.js
export const DIALOG_CONFIGS = {
  deleteSelected: (count) => ({
    title: "Delete articles",
    message: `Are you sure you want to delete ${count} selected items?`,
    isDelete: true,
    icon: "Inbox-cleanup-rafiki.svg",
  }),
  deleteAll: {
    title: "Delete all articles",
    message:
      "Are you sure you still want to delete all items in the recycle bin?",
    isDelete: true,
    icon: "Inbox-cleanup-rafiki.svg",
  },
  restoreSelected: (count) => ({
    title: "Recover articles",
    message: `Are you sure you want to recover ${count} selected items?`,
    isDelete: false,
    icon: "Folder-rafiki.svg",
  }),
  restoreAll: {
    title: "Recover all articles",
    message: "Are you sure you want to recover all items from the recycle bin?",
    isDelete: false,
    icon: "Folder-rafiki.svg",
  },
  alert: {
    title: "Reminder",
    message: "Please select one of the articles!",
    isDelete: false,
    icon: "Publish-article-amico.svg",
  },
};
