import { Line } from "./line";

export function matcher(line1: Line, line2: Line) {
    let l1 = line1.normalized().segments.map(s => s.normalized());
    let l2 = line2.normalized().segments.map(s => s.normalized());

    if (l1.length > l2.length) {
        const t = l1;
        l1 = l2;
        l2 = t;
    }

    let cost = 0;
    const costPerSegment = 1 / l1.length;

    l1.forEach((s1, i) => {
        const l2Index = Math.floor(i * l2.length / l1.length);
        const s2 = l2[l2Index];
        const newCost = 1 - Math.abs(s1.dot(s2));
        cost += newCost * costPerSegment;
    });

    return cost;
}
