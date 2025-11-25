import pool from "../db/client.mjs";

async function seedRobots() {
  try {
    const robots = [
      { name: "Alpha", lat: 52.5200, lon: 13.4050, status: "idle" },
      { name: "Beta", lat: 48.8566, lon: 2.3522, status: "idle" },
      { name: "Gamma", lat: 51.5074, lon: -0.1278, status: "idle" },
    ];

    for (const r of robots) {
      await pool.query(
        `INSERT INTO robots (name, lat, lon, status, updated_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [r.name, r.lat, r.lon, r.status]
      );
    }

    console.log("Seed complete.");
  } catch (err) {
    console.error("Seed failed:", err);
  }
}

export default seedRobots;

