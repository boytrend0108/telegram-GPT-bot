import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import config from 'config';
import { ogg } from './ogg.js';
import { openia } from './openia.js';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

const INITIAL_SESSION = {
  messages: [],
};

bot.use(session());

bot.on(message('voice'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;

  try {
    await ctx.reply(code('I received your message. Wait a second please'));
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = ctx.message.from.id;
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMP3(oggPath, userId);

    const text = await openia.transcription(mp3Path);
    ctx.session.messages.push({ role: openia.roles.USER, content: text });

    const responce = await openia.chat(ctx.session.messages);
    ctx.session.messages.push({
      role: openia.roles.ASSISTANT,
      content: responce.content,
    });

    ctx.reply(responce.content);
  } catch (err) {
    console.log('Error while voice message', err.message);
  }
});

bot.command('start', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply('Hello bro!!!');
});

bot.command('new', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.reply('Жду вашего голосового или тестового сообщения');
});

bot.on(message('text'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;

  try {
    await ctx.reply(code('I received your message. Wait a second please'));

    ctx.session.messages.push({
      role: openia.roles.USER,
      content: ctx.message.text,
    });

    const responce = await openia.chat(ctx.session.messages);
    ctx.session.messages.push({
      role: openia.roles.ASSISTANT,
      content: responce.content,
    });

    ctx.reply(responce.content);
  } catch (err) {
    console.log('Error while voice message', err.message);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
