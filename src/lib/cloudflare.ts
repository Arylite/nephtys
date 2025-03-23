import Cloudflare from "cloudflare";

interface WebtoonAnalytics {
  webtoonId: string;
  views: number;
  lastUpdate?: string;
}

export class CloudflareKVService {
  private cloudflareClient: Cloudflare;
  private namespace: { id: string; title: string } | null = null;
  private namespaces: Array<{ id: string; title: string }> = [];

  constructor() {
    this.cloudflareClient = new Cloudflare({
      apiEmail: process.env.CLOUDFLARE_EMAIL!,
      apiKey: process.env.CLOUDFLARE_API_KEY!,
    });
  }

  async initializeNamespaces() {
    const namespaceList = await this.cloudflareClient.kv.namespaces.list({
      account_id: process.env.ACCOUNT_ID!,
    });

    this.namespaces = namespaceList.result.map((namespace) => ({
      id: namespace.id,
      title: namespace.title,
    }));

    const nephtysNamespace = this.namespaces.find(
      (ns) => ns.title === "nephtys_webtoon_analytics"
    );

    if (!nephtysNamespace) {
      const newNamespace = await this.cloudflareClient.kv.namespaces.create({
        account_id: process.env.ACCOUNT_ID!,
        title: "nephtys_webtoon_analytics",
      });
      const createdNamespace = {
        id: newNamespace.id,
        title: newNamespace.title,
      };
      this.namespaces.push(createdNamespace);
      this.namespace = createdNamespace;
    } else {
      this.namespace = nephtysNamespace;
    }
  }

  getClient(): Cloudflare {
    return this.cloudflareClient;
  }

  getNamespaces(): Array<{ id: string; title: string }> {
    return this.namespaces;
  }

  getNamespace(): { id: string; title: string } | null {
    return this.namespace;
  }

  async getWebtoons() {
    const namespace = await this.cloudflareClient.kv.namespaces.get(
      this.namespace!.id,
      {
        account_id: process.env.ACCOUNT_ID!,
      }
    );
    return namespace;
  }

  async getWebtoonAnalytics(
    webtoonId: string
  ): Promise<WebtoonAnalytics | null> {
    if (!this.namespace) {
      throw new Error("Namespace not initialized");
    }

    try {
      const data = await this.cloudflareClient.kv.namespaces.values.get(
        this.namespace.id,
        webtoonId,
        { account_id: process.env.ACCOUNT_ID! }
      );

      if (!data) return null;

      const analytics = {
        webtoonId,
        views: Number(data.text),
      } as WebtoonAnalytics;

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get webtoon analytics: ${error}`);
    }
  }

  async addWebtoonView(webtoonId: string) {
    if (!this.namespace) {
      throw new Error("Namespace not initialized");
    }

    try {
      // Try to get existing analytics
      const data = await this.cloudflareClient.kv.namespaces.values.get(
        this.namespace.id,
        webtoonId,
        { account_id: process.env.ACCOUNT_ID! }
      );

      const currentViews = data ? Number(data.text) : 0;
      const lastUpdate = new Date().toISOString();
      const updatedAnalytics: WebtoonAnalytics = {
        webtoonId,
        views: currentViews + 1,
        lastUpdate,
      };

      // Save the updated analytics
      await this.cloudflareClient.kv.namespaces.values.update(
        this.namespace.id,
        webtoonId,
        {
          account_id: process.env.ACCOUNT_ID!,
          value: updatedAnalytics.views.toString(),
          metadata: JSON.stringify({ lastUpdate }),
        }
      );

      return updatedAnalytics;
    } catch (error) {
      throw new Error(`Failed to update webtoon views: ${error}`);
    }
  }

  async deleteWebtoonAnalytics(webtoonId: string): Promise<void> {
    if (!this.namespace) {
      throw new Error("Namespace not initialized");
    }

    try {
      await this.cloudflareClient.kv.namespaces.values.delete(
        this.namespace.id,
        webtoonId,
        { account_id: process.env.ACCOUNT_ID! }
      );
    } catch (error) {
      throw new Error(`Failed to delete webtoon analytics: ${error}`);
    }
  }
}

export class CloudflareR2Service {
  private cloudflareClient: Cloudflare;
  private buckets: Cloudflare.R2.Buckets.BucketListResponse | null;
  private bucket: Cloudflare.R2.Buckets.Bucket | null;
  constructor() {
    this.cloudflareClient = new Cloudflare({
      apiEmail: process.env.CLOUDFLARE_EMAIL!,
      apiKey: process.env.CLOUDFLARE_API_KEY!,
    });
    this.buckets = null;
    this.bucket = null;
  }

  async getBuckets() {
    const buckets = await this.cloudflareClient.r2.buckets.list({
      account_id: process.env.ACCOUNT_ID!,
    });
    this.buckets = buckets;
    return buckets;
  }

  async getBucket(bucketName: string) {
    const bucket = await this.cloudflareClient.r2.buckets.get(bucketName, {
      account_id: process.env.ACCOUNT_ID!,
    });
    this.bucket = bucket;
    return bucket;
  }
}

const cloudflareService = new CloudflareKVService();

export default cloudflareService;
