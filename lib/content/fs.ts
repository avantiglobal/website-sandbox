/**
 * Build-time filesystem helpers for the content layer (spec 0.2).
 *
 * All reads happen at build (SSG). No runtime fetching — the CMS is git-based,
 * so content is on disk when Next statically generates each page.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";

/** Absolute path to the /content root. */
export const CONTENT_ROOT = join(process.cwd(), "content");

/** List files in a content subdirectory, filtered by extension. */
export async function listFiles(
  subdir: string,
  ext: string,
): Promise<string[]> {
  const dir = join(CONTENT_ROOT, subdir);
  try {
    const entries = await readdir(dir);
    return entries.filter((f) => f.endsWith(ext)).sort();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

/** Read + parse a markdown file into typed frontmatter and body. */
export async function readMarkdown<T extends Record<string, unknown>>(
  subdir: string,
  file: string,
): Promise<{ data: T; body: string; sourcePath: string }> {
  const sourcePath = join(subdir, file);
  const raw = await readFile(join(CONTENT_ROOT, sourcePath), "utf8");
  const { data, content } = matter(raw);
  return { data: data as T, body: content, sourcePath };
}

/** Read + parse a YAML data file. */
export async function readYaml<T>(relPath: string): Promise<T> {
  const raw = await readFile(join(CONTENT_ROOT, relPath), "utf8");
  return parseYaml(raw) as T;
}
