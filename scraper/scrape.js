import axios from "axios";
import puppeteer from "puppeteer";
import mysql from "mysql2/promise";
import "dotenv/config";

const DB = "beyond_db";

async function scrapePhase1() {
  const listURL = "https://beyondchats.com/blogs/page/14/";
  console.log("Scraping from last page:", listURL);

  // Launch Puppeteer Browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(listURL, { waitUntil: "networkidle2" });

  // Extract all links from browser DOM
  const links = await page.evaluate(() => {
    const anchors = document.querySelectorAll("a");
    return Array.from(anchors).map(a => a.href);
  });

  console.log("All extracted links:", links);


  // Filter only valid ARTICLE pages
  const blogLinks = links.filter(
    link =>
      link &&
      link.includes("/blogs/") &&
      !link.includes("/tag/") &&
      !link.includes("/page/")&&
    link.split("/").length > 4
  );

  // Reverse → oldest first
  const articlesOnly = [...blogLinks].reverse();
  const oldest = articlesOnly.slice(0, 5);

  console.log("Filtered article links:", articlesOnly);
  console.log("5 oldest article links:", oldest);

  if (oldest.length === 0) {
    console.error("No articles found — selector may need update!");
    await browser.close();
    return;
  }

  // Connect to MySQL DB
  const db = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Vignesh@6369",
    database: DB,
  });

  // Visit each article & extract title + content
  for (const url of oldest) {
    try {
      await page.goto(url, { waitUntil: "networkidle2" });

      const article = await page.evaluate(() => {
        const title =
          document.querySelector("h1")?.innerText.trim() ||
          document.querySelector("h2")?.innerText.trim() ||
          "Untitled";

        const content =
          document.querySelector(".elementor-widget-text-editor")?.innerText.trim() ||
          document.querySelector(".has-content-area")?.innerText.trim() ||
          "";

        // RETURN the article object to Node
        return { title, content, source_url: window.location.href };
      });

      if (!article.title || !article.content) {
        console.warn("Skipping empty article:", url);
        continue;
      }

      // INSERT into DB
      await db.execute(
        "INSERT INTO articles (title, content, source_url) VALUES (?,?,?)",
        [article.title, article.content, article.source_url]
      );

      console.log("Inserted:", article.title);
    } catch (err) {
      console.error("Failed scraping:", url, err.message);
    }
  }

  console.log("Phase 1 scraping & DB insert completed!");
  await browser.close();
}

scrapePhase1();
