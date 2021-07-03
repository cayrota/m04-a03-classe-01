const knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'ec2-54-163-97-228.compute-1.amazonaws.com',
      user : 'mjqiovcpinrsmm',
      password : '5de9cc8f6c729d647ebd5f7220db1c109e9a1ae8879eb499ea65798990605df0',
      database : 'dc7477ecgbpf2b'
    }
  });

  module.exports = knex;