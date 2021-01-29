import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { getDataByCountry, getAllCountries } from './api'
import numeral from 'numeral';

let countries = null;

dotenv.config();

const { BOT_API } = process.env;

const bot = new Telegraf(BOT_API);

bot.start((ctx) => ctx.reply('Welcome to CovidGramBot, use /help to see the available commands.'));

// /countries = Devuelve la lista de paises
bot.command('countries', async ctx => {
  ctx.reply(countries.join('\n'))
});


// /countries = Devuelve la lista de paises
bot.command('help', async ctx => {
  Telegraf.te
  const lines = [
    '/countries *List of available countries*',
    '/search \\<string\\> *Search countries by name*',
    '/country \\<name\\> *Covid\\-19 data of specific country*'
  ];
  ctx.replyWithMarkdownV2(lines.join('\n'));
});

// /search = Busca coincidencias en la lista de paises 
bot.command('search', async ctx => {
  const [,search] = ctx.message.text.split(' ');

  if (!search) {
    ctx.reply('You need to specify a string to search, use /search <string>.');
    return;
  }

  const results = countries.filter(item => item.indexOf(search) !== -1);

  ctx.replyWithMarkdownV2(`*Countries*:\n${results.join('\n')}`);
});

// /country = Muestra datos de Covid de un pais
bot.command('country', async ctx => {
  const [,country] = ctx.message.text.split(' ');

  if (!country) {
    ctx.reply('You need to specify the country, use /country <country name>.');
    return;
  }

  if (!countries.includes(country)) {
    ctx.reply('That country not exists, use /countries to get a list of available countries, or use /search <string> to find one.');
    return;
  }

  const response = await getDataByCountry(country);
  const { data } = response;
  const format = number => numeral(number).format('0,0').replace(/,/g, '\\.');

  const lines = [
    `*${data.All.country} Deaths:* ${format(data.All.deaths)}`,
    `*${data.All.country} Confimed cases:* ${format(data.All.confirmed)}`,
    `*${data.All.country} Recovereds:* ${format(data.All.recovered)}`,
  ];

  ctx.replyWithMarkdownV2(lines.join('\n'));
});

async function main() {
  const list = await getAllCountries();
  countries = list.filter(string => string !== 'Global');
  bot.launch();
}

main();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
