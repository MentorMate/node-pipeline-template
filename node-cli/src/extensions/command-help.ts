import { GluegunToolbox } from 'gluegun';

type Option = { name: string; alias: string; description: string };
type Info = {
  description: string;
  usage: string;
  aliases: string[];
  options: Option[];
};
const optionsTable = (options: Option[]) => {
  const longestNameLength = Math.max(...options.map((o) => o.name.length));
  const indent = ' '.repeat(2);
  const minGap = ' '.repeat(4);

  return options
    .map((o) => {
      const alias = o.alias ? `-${o.alias},` : '   ';
      const gap = minGap + ' '.repeat(longestNameLength - o.name.length);
      return `${indent}${alias} --${o.name}${gap}${o.description}`;
    })
    .join('\n');
};

const helpMessage = (info: Info) => `${info.description}

Usage:
${info.usage}

Aliases: ${info.aliases.join(', ')}

Options:
${optionsTable(info.options)}
`;

const helpOption = {
  name: 'help',
  alias: 'h',
  description: 'Print this help message',
};

export default (toolbox: GluegunToolbox) => {
  toolbox.commandHelp = {
    shouldPrint: () => {
      const { parameters } = toolbox;
      const { first, options } = parameters;

      return first === 'help' || options['help'] || options['h'];
    },
    print: ({ options, ...info }: Info) => {
      console.log(
        helpMessage({ ...info, options: options.concat([helpOption]) }),
      );
    },
  };
};
