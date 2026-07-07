const url = "https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1/models";
const key = "sk-ws-H.YMLRIP.uvbw.MEUCIAaf5igyybe8V98FzJ2uxYMatlz2XiFuCDtXhpe8b7NYAiEAmMDcdVjHa6GxfSbLJ9b0BRFX0haBKN0R_PO952knIGQ";

fetch(url, {
  headers: { "Authorization": `Bearer ${key}` }
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
