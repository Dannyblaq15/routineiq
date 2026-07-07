import net from 'net';

const HOST = 'rm-gs58pknz5gxfljmc1go.rwlb.singapore.rds.aliyuncs.com';
const PORT = 3306;

console.log(`\nTesting connection to Database Server: ${HOST}:${PORT}...\n`);

const client = new net.Socket();
client.setTimeout(5000); // 5 second timeout

client.connect(PORT, HOST, function() {
    console.log('✅ SUCCESS! Your computer can reach the Alibaba Cloud RDS database.');
    console.log('The IP Whitelist is correctly configured.\n');
    client.destroy(); 
});

client.on('timeout', function() {
    console.error('❌ TIMEOUT: Could not reach the database within 5 seconds.');
    console.error('Reason: Your current IP address is likely NOT in the Alibaba Cloud RDS IP Whitelist.');
    client.destroy();
});

client.on('error', function(err) {
    console.error('❌ ERROR: Connection failed.');
    console.error(`Reason: ${err.message}`);
    console.error('Ensure you are not on a restrictive Wi-Fi network that blocks port 3306.');
    client.destroy();
});
