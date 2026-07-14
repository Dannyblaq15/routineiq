const url = "https://ws-8nvmb1m9ou8t76hn.cn-beijing.maas.aliyuncs.com/compatible-mode/v1/models";
const key = "sk-ws-H.EDIXPYI.nfz4.MEQCICvWS7yryFvpRB7SAmclTJxKWXTkLKubMxPdFi3OQOi7AiAkni32Y3BuV7tT20Moc6YIocCzSvt37-fs1fA_aB0JQA";

fetch(url, {
  headers: { "Authorization": `Bearer ${key}` }
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
