import { PrismaClient } from "@prisma/client";
import { createClient } from "redis"; // Using the modern Redis client
import process from "process";

const prisma = new PrismaClient();

// Initialize Redis client
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

// Connect Redis client
(async () => {
  let time1 = performance.now();
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect().then(() => {
    let time2 = performance.now();
    console.log(
      "[*] Redis client successfully connected in",
      Math.floor(time2 - time1).toFixed(2),
      "ms"
    );
  });
})();

export async function getRules(userId: string) {
  const cacheKey = `${userId}_rules`;

  if (!userId) {
    return Promise.reject("User ID is required");
  }

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Fetching data from Redis cache");
      return JSON.parse(cachedData);
    }

    const rules = await prisma.rules.findMany({
      where: {
        active: true,
        userId: userId,
      },
    });

    // (30 dite = 2,592,000 sekonda)
    await redisClient.setEx(cacheKey, 2_592_000, JSON.stringify(rules));

    console.log("Fetching data from the database and caching it");
    return rules;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
}

export async function getRuleById(ruleId: string) {
  try {
    if (!ruleId) {
      return Promise.reject("Rule ID is required");
    }

    const rule = await prisma.rules.findUnique({
      where: {
        id: ruleId,
      },
    });

    return Promise.resolve(rule);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createRule(data: any, userId: string) {
  try {
    if (!userId) {
      return Promise.reject("User ID is required");
    }

    const rule = await prisma.rules.create(data);
    await redisClient.del(`${userId}_rules`);
    await redisClient.del(`all_active_rules_user_${userId}`);
    await redisClient.del(`all_active_rules_user_${userId}_${rule.type}`);
    await redisClient.del(`all_active_rules`);
    await redisClient.del(`all_rules`);

    return Promise.resolve(rule);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function updateRule(data: any, ruleId: string, userId: string) {
  try {
    if (!userId || !ruleId) {
      return Promise.reject("User ID or Rule ID is required");
    }

    const rule = await prisma.rules.update({
      where: {
        id: ruleId,
      },
      data: data,
    });

    await redisClient.del(`${userId}_rules`);
    await redisClient.del(`all_active_rules_user_${userId}`);
    await redisClient.del(`all_active_rules_user_${userId}_${rule.type}`);
    await redisClient.del(`all_active_rules`);
    await redisClient.del(`all_rules`);

    return Promise.resolve(rule);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteRule(ruleId: string, userId: string) {
  try {
    if (!ruleId || !userId) {
      return Promise.reject("Rule ID or User ID is required");
    }

    const rule = await prisma.rules.delete({
      where: {
        id: ruleId,
      },
    });
    await redisClient.del(`${userId}_rules`);
    await redisClient.del(`all_active_rules_user_${userId}`);
    await redisClient.del(`all_active_rules_user_${userId}_${rule.type}`);
    await redisClient.del(`all_active_rules`);
    await redisClient.del(`all_rules`);

    return Promise.resolve(rule);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getAllRules(page?: number, perPage?: number) {
  const cacheKey = `all_rules`;

  if (!page || !perPage) {
    page = 1;
    perPage = 10;
  }

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const rules = await prisma.rules.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    await redisClient.setEx(cacheKey, 2_592_000, JSON.stringify(rules));

    return rules;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
}

export async function getAllActiveRules(page?: number, perPage?: number) {
  const cacheKey = `all_active_rules`;

  if (!page || !perPage) {
    page = 1;
    perPage = 10;
  }

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const rules = await prisma.rules.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        active: true,
      },
    });

    await redisClient.setEx(cacheKey, 2_592_000, JSON.stringify(rules));

    return rules;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
}

export async function getAllActiveRulesFromUserId(
  userId: string,
  page?: number,
  perPage?: number
) {
  const cacheKey = `all_active_rules_user_${userId}`;

  if (!page || !perPage) {
    page = 1;
    perPage = 10;
  }

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const rules = await prisma.rules.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        active: true,
        userId: userId,
      },
    });

    await redisClient.setEx(cacheKey, 2_592_000, JSON.stringify(rules));

    return rules;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
}

export async function getAllActiveRulesFromUserIdWithType(
  userId: string,
  type: string,
  page?: number,
  perPage?: number
) {
  const cacheKey = `all_active_rules_user_${userId}_${type}`;

  if (!page || !perPage) {
    page = 1;
    perPage = 10;
  }

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const rules = await prisma.rules.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        active: true,
        userId: userId,
        type: type,
      },
    });

    await redisClient.setEx(cacheKey, 2_592_000, JSON.stringify(rules));

    return rules;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
}

process.on("SIGINT", async () => {
  await redisClient.quit();
  console.log("[*] Redis client disconnected and process exited");
  process.exit(0);
});
