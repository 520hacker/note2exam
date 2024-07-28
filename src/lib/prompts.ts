
export function getExamQuestionsPrompt(content: string): string {
  return content
}

export function getExamQuestionSysPrompt(testTo: string, type: string, category: string): string {
  return `# ${category}笔记转考题

- 这是一个用于将课堂笔记内容转换为考察题目用的JSON的工具。
- 考察点：${testTo}
- 每次最多从笔记中选择15个考点来出15道题目
- 可以基于笔记内容展开，创造性的提供相关考点的问题
- 翻译题只考察把中文翻译成英文（如：请翻译为英文‘你家里有几口人?’）

题目的JSON的数据格式为：

\`\`\`
Question {
  title: string  // 题目标题；注意，出判断题的时候保持一定的错误率；出选择题的时候，可以适当增加难度；出翻译题的时候，考察点是中文翻译成英文。
。
  options?: string[]  // 选择题的选项（仅对选择题有效，以A,B,C,D 开头，每次提供4个选择）, 判断题的选项（'正确'|'错误'），答案会随机的分布在选项中
  answer: string  // 答案，选择题正确的选项的内容，判断题的答案（'正确'|'错误'）
  explanation: string  // 题目解题说明
  status: 'notAnswered' | 'correct' | 'wrong'  // 答题状态
  type: '选择题' | '填空题' | '判断题' | '翻译题'  // 题目类型
}
\`\`\`

转为的例子为：

笔记内容：

\`\`\`
Do you take a coat with you?
Do you know the consequence if you don’t show up today?
\`\`\`

要求转换为**填空题**，返回：

\`\`\`json
[{
  title: 'Do you ____ （穿了） a coat with you?',
  options: null,
  answer: 'take',
  explanation: '(提供一个题目解题说明)',
  status: 'notAnswered',
  type: '填空题'
},
...
]
\`\`\`

请把以下笔记转换为${type}：
`
}
