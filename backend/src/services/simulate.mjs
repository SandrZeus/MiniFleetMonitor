import pool from '../db/client.mjs';

async function simulate(robotId = null) {
  try {
    const robots = robotId
    ? await pool.query(`SELECT * FROM robots WHERE id=$1`, [robotId])
    : await pool.query(`SELECT * FROM robots`);
    
    const updatedRobots = [];

    for(const robot of robots.rows) {
      const lat = (Math.random() * 180 - 90).toFixed(6);
      const lon = (Math.random() * 360 - 180).toFixed(6);

      const result = await pool.query(
      `UPDATE robots SET lat=$1, lon=$2, status=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
      [lat, lon, 'moving', robot.id]
      );
      
      updatedRobots.push(result.rows[0]);
    }

    return robotId ? updatedRobots[0] : updatedRobots;
  } catch (error) {
    console.error('Error updating robots:', error);
    return robotId ? null : [];
  }
}

export default simulate;
