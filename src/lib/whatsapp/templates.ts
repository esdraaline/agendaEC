type TemplateData = {
  nome?: string;
  valor?: string;
  produto?: string;
  data?: string;
  saldo?: string;
};

export function parseTemplate(template: string, data: TemplateData): string {
  let parsed = template;
  
  if (data.nome) parsed = parsed.replace(/{nome}/g, data.nome);
  if (data.valor) parsed = parsed.replace(/{valor}/g, data.valor);
  if (data.produto) parsed = parsed.replace(/{produto}/g, data.produto);
  if (data.data) parsed = parsed.replace(/{data}/g, data.data);
  if (data.saldo) parsed = parsed.replace(/{saldo}/g, data.saldo);

  // Remove any remaining unresolved variables just in case
  parsed = parsed.replace(/{.*?}/g, '');
  
  return parsed.trim();
}
