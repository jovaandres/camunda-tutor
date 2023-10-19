require('dotenv').config();
const { Client, logger, Variables } = require('camunda-external-task-client-js');
const nodemailer = require("nodemailer");

const config = {
  baseUrl: 'http://localhost:8080/engine-rest',
  use: logger,
  asyncResponseTimeout: 10000
};

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

const client = new Client(config);

client.subscribe('nasabahCheck', async function ({ task, taskService }) {
  console.log('Pemeriksaan Jadwal Dimulai');
  const name = task.variables.get('name');
  const localVariables = new Variables();

  if (name === "fuad") {
    localVariables.set("isBayar", true);
    console.log(`Ditemukan nama ${name} didalam database`);
  } else if (name === "teguh") {
    localVariables.set("isBayar", false);
    console.log(`Ditemukan nama ${name} didalam database`);
  } else {
    localVariables.set("isBayar", null);
    console.log('Tidak ditemukan nama didalam database');
  }

  await taskService.complete(task, localVariables);
  console.log('Pemeriksaan Jadwal Selesai')
});

client.subscribe('paymentNotification', async function ({ task, taskService }) {
  console.log('Pemberitahuan Nasabah Dimulai');
  const name = task.variables.get('name');

  const mailOption = {
    from: process.env.MAIL_ADDRESS,
    to: `${name}@gmail.com`,
    subject: "Pemberitahuan Tenggat Pembayaran",
    text: "Mohon dibayar sebelum batas waktu pembayaran!"
  }

  transporter.sendMail(mailOption, function(error, info) {
    if (error) {
      console.log(`Gagal: ${error}`)
    } else {
      console.log(`Berhasil mengirim pemberitahuan ke ${name}`)
    }
  })

  await taskService.complete(task);
  console.log('Pemberitahuan Nasabah Selesai');
});

client.subscribe('paymentNotification2', async function ({ task, taskService }) {
  console.log('Pemberitahuan Nasabah Dimulai');
  const name = task.variables.get('name');

  const mailOption = {
    from: process.env.MAIL_ADDRESS,
    to: `${name}@gmail.com`,
    subject: "Pemberitahuan Pelunasan Pembayaran",
    text: "Mohon dilunaskan untuk bulan ini!"
  }

  transporter.sendMail(mailOption, function(error, info) {
    if (error) {
      console.log(`Gagal: ${error}`)
    } else {
      console.log(`Berhasil mengirim pemberitahuan ke ${name}`)
    }
  })

  await taskService.complete(task);
  console.log('Pemberitahuan Nasabah Selesai');
});
