export function mapScoresToStreams(scores) {
  const order = Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const top = order[0];
  const map = {
    logical: ['Science', 'Engineering'],
    quantitative: ['Commerce', 'Data Science'],
    creative: ['Arts', 'Design'],
    verbal: ['Humanities', 'Law'],
    social: ['Management', 'Social Sciences']
  };
  return map[top] || ['General'];
}



