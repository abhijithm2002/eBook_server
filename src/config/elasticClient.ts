import { Client } from "@elastic/elasticsearch";
import env from 'dotenv';

env.config();

const elasticClient = new Client({ 
    node: process.env.ELASTICSEARCH_URL,
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME as string, 
        password: process.env.ELASTICSEARCH_PASSWORD as string, 
    },
});

(async () => {
    try {
        console.log("Connecting to Elasticsearch...");
        await elasticClient.ping();
        console.log("Elasticsearch is up and running.");
    } catch (error) {
        console.error("Error connecting to Elasticsearch:", error);
    }
})();

export default elasticClient;


