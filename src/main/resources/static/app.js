"use strict";
const field = (name, label, type = "text", required = true, max) => ({
  name,
  label,
  type,
  required,
  max,
});
const config = {
  categorias: {
    title: "Categorias",
    description: "Classifique as solicitações de suporte.",
    fields: [
      field("nome", "Nome", "text", true, 60),
      field("descricao", "Descrição", "textarea", false, 255),
    ],
  },
  usuarios: {
    title: "Usuários",
    description: "Gerencie as pessoas que utilizam o atendimento.",
    fields: [
      field("nome", "Nome", "text", true, 60),
      field("email", "E-mail", "email", true, 255),
      field("telefone", "Telefone", "tel", false, 30),
      field("cargo", "Cargo", "text", false, 60),
    ],
  },
  chamados: {
    title: "Chamados",
    description: "Organize e acompanhe as solicitações de suporte.",
    fields: [
      field("titulo", "Título", "text", true, 100),
      field("descricao", "Descrição", "textarea", true, 2000),
      {
        ...field("prioridade", "Prioridade", "select"),
        options: ["BAIXA", "MEDIA", "ALTA", "URGENTE"],
      },
      {
        ...field("status", "Status", "select"),
        options: ["ABERTO", "EM_ANDAMENTO", "RESOLVIDO", "FECHADO"],
      },
      field("prazo", "Prazo", "date"),
      {
        ...field("categoriaId", "Categoria", "select"),
        resource: "categorias",
        property: "categoria",
      },
      {
        ...field("solicitanteId", "Solicitante", "select"),
        resource: "usuarios",
        property: "solicitante",
      },
    ],
  },
};
const $ = (id) => document.getElementById(id);
let current = "chamados",
  items = [],
  editing = null,
  version = 0;
async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      data?.erros?.join("\n") || data?.message || `Erro ${response.status}`,
    );
  return data;
}
const active = (item) => item.ativa ?? item.ativo;
function cell(row, value) {
  const td = document.createElement("td");
  td.textContent = value ?? "—";
  row.append(td);
  return td;
}
function render() {
  const c = config[current];
  $("head").replaceChildren();
  const hr = document.createElement("tr");
  const visible = c.fields.filter((f) => f.name !== "descricao").slice(0, 4);
  for (const label of [
    "ID",
    ...visible.map((f) => f.label),
    "Situação",
    "Ações",
  ]) {
    const th = document.createElement("th");
    th.textContent = label;
    hr.append(th);
  }
  $("head").append(hr);
  $("rows").replaceChildren();
  const q = $("search").value.toLocaleLowerCase();
  const filtered = items.filter((x) =>
    JSON.stringify(x).toLocaleLowerCase().includes(q),
  );
  for (const item of filtered) {
    const row = document.createElement("tr");
    cell(row, item.id);
    visible.forEach((f) =>
      cell(row, f.property ? item[f.property]?.nome : item[f.name]),
    );
    const badge = document.createElement("span");
    badge.className = "badge" + (active(item) ? "" : " off");
    badge.textContent = active(item) ? "Ativo" : "Inativo";
    cell(row, "").append(badge);
    const actions = cell(row, "");
    const box = document.createElement("div");
    box.className = "actions";
    for (const [label, fn] of [
      ["Consultar", () => open(item.id, true)],
      ["Editar", () => open(item.id, false)],
      ["Apagar", () => remove(item.id)],
    ]) {
      const b = document.createElement("button");
      b.textContent = label;
      b.onclick = fn;
      b.disabled = label === "Apagar" && !active(item);
      box.append(b);
    }
    actions.append(box);
    $("rows").append(row);
  }
  if (!filtered.length) {
    const row = document.createElement("tr");
    const td = cell(row, "Nenhum registro encontrado.");
    td.colSpan = visible.length + 3;
    td.className = "empty";
    $("rows").append(row);
  }
  $("total").textContent = items.length;
  $("active").textContent = items.filter(active).length;
  $("inactive").textContent = items.filter((x) => !active(x)).length;
}
async function load() {
  const request = ++version;
  const resource = current;
  $("message").textContent = "Carregando…";
  try {
    const result = await api("/" + resource);
    if (request !== version) return;
    items = result;
    render();
    $("message").textContent = "";
  } catch (e) {
    if (request === version) {
      items = [];
      render();
      $("message").textContent = e.message;
    }
  }
}
async function open(id = null, readonly = false) {
  const resource = current;
  const c = config[resource];
  $("new").disabled = true;
  try {
    const item = id ? await api(`/${resource}/${id}`) : {};
    const lists = {};
    await Promise.all(
      c.fields
        .filter((f) => f.resource)
        .map(async (f) => {
          lists[f.resource] = await api("/" + f.resource);
        }),
    );
    if (resource !== current) return;
    editing = id;
    $("fields").replaceChildren();
    $("form-error").textContent = "";
    $("form-title").textContent =
      `${readonly ? "Consultar" : id ? "Editar" : "Novo registro"} • ${c.title}`;
    for (const f of c.fields) {
      const label = document.createElement("label");
      label.textContent = f.label + (f.required ? " *" : "");
      const input = document.createElement(
        f.type === "textarea"
          ? "textarea"
          : f.type === "select"
            ? "select"
            : "input",
      );
      input.name = f.name;
      input.required = f.required;
      input.disabled = readonly;
      if (input.tagName === "INPUT") input.type = f.type;
      if (f.max) input.maxLength = f.max;
      if (["nome", "titulo"].includes(f.name)) input.minLength = 2;
      if (f.type === "select") {
        const options = f.resource
          ? lists[f.resource]
              .filter((x) => active(x) || x.id === item[f.property]?.id)
              .map((x) => [x.id, x.nome])
          : f.options.map((x) => [x, x.replaceAll("_", " ")]);
        input.add(new Option("Selecione…", ""));
        options.forEach(([value, text]) => input.add(new Option(text, value)));
      }
      input.value = f.property
        ? (item[f.property]?.id ?? "")
        : (item[f.name] ?? "");
      label.append(input);
      $("fields").append(label);
    }
    $("save").hidden = readonly;
    $("dialog").showModal();
  } catch (e) {
    $("message").textContent = e.message;
  } finally {
    $("new").disabled = false;
  }
}
async function remove(id) {
  if (!confirm(`Apagar o registro #${id}? Ele será marcado como inativo.`))
    return;
  try {
    await api(`/${current}/${id}`, { method: "DELETE" });
    await load();
  } catch (e) {
    $("message").textContent = e.message;
  }
}
$("form").onsubmit = async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  config[current].fields.forEach((f) => {
    if (f.resource) data[f.name] = Number(data[f.name]);
  });
  $("save").disabled = true;
  $("form-error").textContent = "";
  try {
    await api(`/${current}${editing ? "/" + editing : ""}`, {
      method: editing ? "PUT" : "POST",
      body: JSON.stringify(data),
    });
    $("dialog").close();
    await load();
  } catch (e) {
    $("form-error").textContent = e.message;
  } finally {
    $("save").disabled = false;
  }
};
for (const b of document.querySelectorAll("[data-resource]"))
  b.onclick = () => {
    current = b.dataset.resource;
    document.querySelectorAll("nav button").forEach((x) => {
      x.classList.toggle("selected", x === b);
      x.setAttribute("aria-current", x === b ? "page" : "false");
    });
    $("title").textContent = config[current].title;
    $("subtitle").textContent = config[current].description;
    $("search").value = "";
    items = [];
    render();
    load();
  };
$("new").onclick = () => open();
$("refresh").onclick = load;
$("search").oninput = render;
$("close").onclick = $("cancel").onclick = () => $("dialog").close();
document.querySelector('[data-resource="chamados"]').click();
