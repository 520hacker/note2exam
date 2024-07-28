import { Message, AIMessage } from './models'
export function initBaseMessage(messages: Message[], model: string, stream: boolean): AIMessage {
  var aimsg: AIMessage = {
    messages,
    stream: stream,
    model,
    temperature: 0.5,
    presence_penalty: 0,
    frequency_penalty: 0,
    top_p: 1
  };
  return aimsg;
}

/**
 * 从 Markdown 中提取第一个有效的 JSON 对象。
 * @param content Markdown 内容
 * @returns 第一个有效的 JSON 字符串，如果不存在或格式错误则返回空字符串。
 */
export function getJsonFromMarkdown(content: string): string {
  // Using regex to match JSON arrays in markdown
  const regex = /\[\s*{.*?}\s*\]/s;

  try {
    // console.log(content);
    // Find the matched JSON part
    const match = content.match(regex);
    if (!match) {
      // No match found, return empty string
      return '';
    }

    const potentialJson = match[0]; // the matched part which includes brackets
    let json;
    try {
      // Try to parse JSON
      // console.log(potentialJson);
      json = JSON.parse(potentialJson);
      // If successful, convert JSON object to string and return
      return JSON.stringify(json);
    } catch (error) {
      // JSON parsing failed, log error and return empty string
      console.error('Failed to parse JSON from Markdown:', error);
      return '';
    }
  } catch (error) {
    // Catch any other exceptions and handle them appropriately
    console.error('Unexpected error occurred:', error);
    return '';
  }
}