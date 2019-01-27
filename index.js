#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const commander = require('commander');

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Filor", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
};

const askQuestions = () => {
  const questions = [
    {
      name: "FILENAME",
      type: "input",
      message: "What is the name of the file without extension?"
    },
    {
      type: "list",
      name: "EXTENSION",
      message: "What is the file extension?",
      choices: [".rb", ".js", ".php", ".css",".txt"],
      filter: function(val) {
        return val.split(".")[1];
      }
    }
  ];
  return inquirer.prompt(questions);
};

const createFile = (filename, extension) => {
  const filePath = `${process.cwd()}/${filename}.${extension}`;
  shell.touch(filePath);
  return filePath;
};

const success = filepath => {
  console.log(
    chalk.white.bgGreen.bold(`Done! File created at ${filepath}`)
  );
};

const CreateFile = async () => {

  init();

  const answers = await askQuestions();
  const { FILENAME, EXTENSION } = answers;

  const filePath = createFile(FILENAME, EXTENSION);

  success(filePath);
};
//List file function
const ListFiles = () =>{
  var c=1;
  shell.ls('-A').forEach(function(file) {
  shell.echo(chalk.magenta(c+". ")+chalk.white.bgBlue.bold(file));
  c++;
});
};
const DeleteFile =(fn) =>{
  var c=0;
    shell.ls('-A').forEach(function(file){
    if(fn ==file)
    c++;
  });

  if(c!=0){
  shell.rm('-rf',fn);
  console.log(chalk.red.bold(fn));}
  else
  console.log(chalk.red.bold('Err:No file present with filename -> '+fn));
};

//Create file
commander
.command('create')
.alias('c')
.description('Create File')
.action(()=>{
  CreateFile();
});

//List Files
commander
.command('list')
.alias('l')
.description('List files')
.action(() => {
ListFiles();
});

commander
.command('delete <_filename>')
.alias('r')
.description('delete file')
.action(_filename => DeleteFile(_filename));

//Check argv
if (!process.argv.slice(2).length ) {
  commander.outputHelp();
  process.exit();
};
//Input argv
commander.parse(process.argv);
