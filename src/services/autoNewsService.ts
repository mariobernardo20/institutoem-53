// Automatic news fetching and indexing service
import { RealNewsService } from "./realNewsService";
import { NewsService } from "./newsService";
import { supabase } from "@/integrations/supabase/client";

export class AutoNewsService {
  private static readonly UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
  private static intervalId: NodeJS.Timeout | null = null;
  
  // Categories to automatically fetch news for
  private static readonly CATEGORIES = ["Imigração", "Direito"];
  
  // Maximum number of articles to store per category
  private static readonly MAX_ARTICLES_PER_CATEGORY = 50;

  /**
   * Start automatic news fetching
   */
  static startAutoFetch(): void {
    console.log("🤖 Starting automatic news fetching...");
    
    // Fetch immediately
    this.fetchAndIndexNews().catch(console.error);
    
    // Set up interval for periodic updates
    this.intervalId = setInterval(() => {
      this.fetchAndIndexNews().catch(console.error);
    }, this.UPDATE_INTERVAL);
  }

  /**
   * Stop automatic news fetching
   */
  static stopAutoFetch(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("🛑 Stopped automatic news fetching");
    }
  }

  /**
   * Manually trigger news update
   */
  static async manualUpdate(): Promise<{ success: boolean; message: string; articlesAdded: number }> {
    try {
      const articlesAdded = await this.fetchAndIndexNews();
      return {
        success: true,
        message: `Successfully updated news. Added ${articlesAdded} new articles.`,
        articlesAdded
      };
    } catch (error) {
      console.error("Manual news update failed:", error);
      return {
        success: false,
        message: `Failed to update news: ${error instanceof Error ? error.message : 'Unknown error'}`,
        articlesAdded: 0
      };
    }
  }

  /**
   * Fetch and index news from external sources
   */
  private static async fetchAndIndexNews(): Promise<number> {
    console.log("📰 Fetching latest news...");
    let totalAdded = 0;

    for (const category of this.CATEGORIES) {
      try {
        // Fetch real news for this category
        const newsItems = await RealNewsService.fetchRealNews(category);
        console.log(`📊 Found ${newsItems.length} articles for ${category}`);

        let addedForCategory = 0;
        
        for (const newsItem of newsItems) {
          try {
            // Check if article already exists (by title and category)
            const { data: existingNews } = await supabase
              .from("news")
              .select("id")
              .eq("title", newsItem.title)
              .eq("category", category)
              .maybeSingle();

            if (!existingNews) {
              // Save new article
              const { error } = await supabase
                .from("news")
                .insert({
                  title: newsItem.title,
                  content: newsItem.content,
                  category: category,
                  image_url: this.getDefaultImageForCategory(category),
                  published_at: newsItem.publishedAt,
                  status: "published",
                  author_id: null,
                  is_featured: false
                });

              if (error) {
                console.error(`❌ Error saving article "${newsItem.title}":`, error);
              } else {
                addedForCategory++;
                console.log(`✅ Added article: "${newsItem.title}"`);
              }
            }
          } catch (error) {
            console.error(`❌ Error processing article "${newsItem.title}":`, error);
          }
        }

        totalAdded += addedForCategory;
        console.log(`📈 Added ${addedForCategory} new articles for ${category}`);

        // Clean up old articles if we have too many
        await this.cleanupOldArticles(category);
        
      } catch (error) {
        console.error(`❌ Error fetching news for category ${category}:`, error);
      }
    }

    console.log(`🎉 News update complete. Total articles added: ${totalAdded}`);
    return totalAdded;
  }

  /**
   * Remove old articles to keep database size manageable
   */
  private static async cleanupOldArticles(category: string): Promise<void> {
    try {
      // Get count of articles for this category
      const { count } = await supabase
        .from("news")
        .select("id", { count: "exact", head: true })
        .eq("category", category);

      if (count && count > this.MAX_ARTICLES_PER_CATEGORY) {
        // Get oldest articles to delete
        const articlesToDelete = count - this.MAX_ARTICLES_PER_CATEGORY;
        
        const { data: oldArticles } = await supabase
          .from("news")
          .select("id")
          .eq("category", category)
          .order("published_at", { ascending: true })
          .limit(articlesToDelete);

        if (oldArticles && oldArticles.length > 0) {
          const idsToDelete = oldArticles.map(article => article.id);
          
          const { error } = await supabase
            .from("news")
            .delete()
            .in("id", idsToDelete);

          if (error) {
            console.error(`❌ Error cleaning up old articles for ${category}:`, error);
          } else {
            console.log(`🧹 Cleaned up ${articlesToDelete} old articles for ${category}`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error during cleanup for ${category}:`, error);
    }
  }

  /**
   * Get default image for category
   */
  private static getDefaultImageForCategory(category: string): string {
    const imageMap: Record<string, string> = {
      "Imigração": "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png",
      "Direito": "/lovable-uploads/a63bef40-515c-44b5-a824-75a232dc40a3.png"
    };
    
    return imageMap[category] || "/lovable-uploads/fb46a527-5bbf-4865-a44c-b3109d663fa6.png";
  }

  /**
   * Get news statistics
   */
  static async getNewsStats(): Promise<{
    totalArticles: number;
    articlesByCategory: Record<string, number>;
    lastUpdate: string | null;
  }> {
    try {
      // Get total count
      const { count: totalArticles } = await supabase
        .from("news")
        .select("id", { count: "exact", head: true });

      // Get count by category
      const articlesByCategory: Record<string, number> = {};
      
      for (const category of this.CATEGORIES) {
        const { count } = await supabase
          .from("news")
          .select("id", { count: "exact", head: true })
          .eq("category", category);
        
        articlesByCategory[category] = count || 0;
      }

      // Get latest article date
      const { data: latestArticle } = await supabase
        .from("news")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        totalArticles: totalArticles || 0,
        articlesByCategory,
        lastUpdate: latestArticle?.created_at || null
      };
    } catch (error) {
      console.error("Error getting news stats:", error);
      return {
        totalArticles: 0,
        articlesByCategory: {},
        lastUpdate: null
      };
    }
  }
}