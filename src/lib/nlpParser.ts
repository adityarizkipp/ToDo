import { Priority } from '@/types/todo';

interface ParsedTaskInput {
  cleanTitle: string;
  priority: Priority;
  dueDate?: string;
  category: string;
}

export function parseNaturalLanguageInput(input: string): ParsedTaskInput {
  let text = input.trim();
  let priority: Priority = 'medium';
  let dueDate: string | undefined = undefined;
  let category = 'General';

  // 1. Parse Priority: !high, !urgent, !p1 -> high | !med, !medium, !p2 -> medium | !low, !p3 -> low
  if (/!(high|urgent|tinggi|p1)\b/i.test(text)) {
    priority = 'high';
    text = text.replace(/!(high|urgent|tinggi|p1)\b/gi, '');
  } else if (/!(med|medium|sedang|p2)\b/i.test(text)) {
    priority = 'medium';
    text = text.replace(/!(med|medium|sedang|p2)\b/gi, '');
  } else if (/!(low|rendah|santai|p3)\b/i.test(text)) {
    priority = 'low';
    text = text.replace(/!(low|rendah|santai|p3)\b/gi, '');
  }

  // 2. Parse Category: #work, #personal, #design, etc.
  const tagMatch = text.match(/#(\w+)/);
  if (tagMatch) {
    category = tagMatch[1].charAt(0).toUpperCase() + tagMatch[1].slice(1);
    text = text.replace(/#\w+/g, '');
  }

  // 3. Parse Due Dates (ID & EN keywords)
  const now = new Date();
  const lowerText = text.toLowerCase();

  if (/\b(besok|tomorrow)\b/i.test(lowerText)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    dueDate = d.toISOString().split('T')[0];
    text = text.replace(/\b(besok|tomorrow)\b/gi, '');
  } else if (/\b(lusa|day after tomorrow)\b/i.test(lowerText)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 2);
    dueDate = d.toISOString().split('T')[0];
    text = text.replace(/\b(lusa|day after tomorrow)\b/gi, '');
  } else if (/\b(hari ini|today)\b/i.test(lowerText)) {
    dueDate = now.toISOString().split('T')[0];
    text = text.replace(/\b(hari ini|today)\b/gi, '');
  }

  // Clean trailing and multiple spaces
  const cleanTitle = text.replace(/\s+/g, ' ').trim();

  return {
    cleanTitle: cleanTitle || input.trim(),
    priority,
    dueDate,
    category
  };
}
