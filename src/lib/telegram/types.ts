export type TelegramInlineButton = {
  text: string;
  url?: string;
  callback_data?: string;
};

export type TelegramUpdate = {
  message?: {
    chat: { id: number };
    from?: { id: number };
    text?: string;
  };
  callback_query?: {
    id: string;
    from: { id: number };
    message?: {
      chat: { id: number };
      message_id: number;
    };
    data?: string;
  };
};

export type TelegramSendOptions = {
  replyMarkup?: {
    inline_keyboard: TelegramInlineButton[][];
  };
  parseMode?: "HTML" | "Markdown";
};
