# word2read

使用 React + React Router + Nodejs + Express 构建的语料分析工具。
使用 epub-parser 对前端提交的 epub 文件进行解析，经过正则化处理，使用 Compromise 进行 NLP 处理，提取词汇，进行词形还原和词频统计，并和 COCA 语料库进行对比，获取词汇词频，同时提取词汇所在原句。
将 SQLite Wasm 与 OPFS 持久化后端结合使用，实现离线存储和数据持久化。
