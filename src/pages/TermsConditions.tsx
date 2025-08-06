import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-primary-foreground hover:text-primary-foreground/80 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold">Termos e Condições</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none text-foreground">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">TERMOS E CONDIÇÕES DE UTILIZAÇÃO</h2>
            <p className="text-center text-muted-foreground mb-6">Última Atualização: 24/04/2025</p>
          </div>

          <h2 className="text-2xl font-semibold mb-4">PREÂMBULO</h2>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            Os presentes Termos e Condições (doravante "Termos") regulam o acesso e a utilização da plataforma online Instituto Empreendedor acessível através do website Instituto Empreendedor.pt ou hscreem.pt e eventuais aplicações móveis associadas, propriedade e operada Happy Screem , pessoa coletiva n.º [NIPC da Empresa], com em Portugal Lisboa Almada ] (doravante "Empresa" ou "nós").
          </p>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            A utilização da Plataforma atribui a condição de Utilizador (doravante "Utilizador" ou "seu") e implica a aceitação plena e sem reservas de todas as disposições incluídas nestes Termos, bem como na Política de Privacidade e Política de Cookies, na versão vigente em cada momento em que acede à Plataforma. Caso não concorde integralmente com os presentes Termos, não deverá utilizar a Plataforma.
          </p>

          <h2 className="text-2xl font-semibold mb-4">1. DEFINIÇÕES</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter as definições do rascunho anterior, garantindo consistência com a Política de Privacidade).
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. ELEGIBILIDADE E REGISTO DE CONTA</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, reforçando a responsabilidade do Utilizador pela veracidade dos dados e segurança da conta).
          </p>

          <h2 className="text-2xl font-semibold mb-4">3. DESCRIÇÃO DOS SERVIÇOS</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter a descrição detalhada dos serviços do rascunho anterior, assegurando que reflete fielmente as funcionalidades).
          </p>

          <h2 className="text-2xl font-semibold mb-4">4. PLANOS, PREÇOS E PAGAMENTOS</h2>
          <p className="mb-4 text-muted-foreground">
            <strong>4.1.</strong> O acesso a determinadas funcionalidades e serviços pode estar sujeito ao pagamento de taxas, através de modelos de subscrição periódica (mensal ou anual) ou pagamento único, conforme detalhado na Plataforma.
          </p>
          <p className="mb-4 text-muted-foreground">
            <strong>4.2.</strong> Os preços indicados na Plataforma para consumidores são apresentados em Euros (€) e incluem o Imposto sobre o Valor Acrescentado (IVA) à taxa legal em vigor em Portugal. Para utilizadores empresariais, os preços poderão ser apresentados sem IVA, sendo tal indicação clara.
          </p>
          <p className="mb-4 text-muted-foreground">
            <strong>4.3.</strong> O pagamento será processado através dos métodos de pagamento disponibilizados na Plataforma (ex: cartão de crédito, débito direto, referência multibanco), geralmente através de prestadores de serviços de pagamento externos e seguros (ex: Stripe, PayPal, IfthenPay, Mpesa). O Utilizador é responsável por fornecer dados de pagamento válidos e mantê-los atualizados.
          </p>
          <p className="mb-4 text-muted-foreground">
            <strong>4.4.</strong> As subscrições pagas poderão renovar-se automaticamente por períodos iguais aos inicialmente subscritos, salvo se o Utilizador proceder ao seu cancelamento antes da data de renovação, através das ferramentas disponibilizadas na sua área de conta ou contactando o suporte ao cliente com a antecedência indicada [ex: 48 horas antes]. A Empresa informará o Utilizador sobre a renovação automática e o respetivo custo antes da mesma ocorrer.
          </p>
          <p className="mb-4 text-muted-foreground">
            <strong>4.5. Direito de Livre Resolução (Aplicável a Consumidores):</strong>
          </p>
          <p className="mb-4 text-muted-foreground ml-4">
            <strong>a)</strong> Nos termos do Decreto-Lei n.º 24/2014, de 14 de fevereiro, na sua redação atual, o Utilizador que seja considerado consumidor (pessoa singular que atue com fins que não se integrem no âmbito da sua atividade comercial, industrial, artesanal ou profissional) tem o direito de resolver livremente o contrato de aquisição de um serviço pago celebrado à distância, no prazo de 14 dias consecutivos a contar da data da celebração do contrato (data da confirmação da subscrição/compra), sem necessidade de indicar qualquer motivo e sem incorrer em quaisquer custos, para além dos previstos na lei.
          </p>
          <p className="mb-4 text-muted-foreground ml-4">
            <strong>b)</strong> Para exercer o direito de livre resolução, o Utilizador deve comunicar à Empresa a sua decisão de resolução do contrato por meio de uma declaração inequívoca (ex: carta enviada pelo correio, correio eletrónico para suporte@hscreem.ptp ou através de formulário de livre resolução se disponibilizado na Plataforma) antes do fim do prazo de 14 dias.
          </p>
          <p className="mb-4 text-muted-foreground ml-4">
            <strong>c)</strong> Perda do Direito de Livre Resolução: O Utilizador reconhece e aceita que, caso solicite que a prestação do serviço (ex: acesso imediato a todas as funcionalidades premium, realização de testes pagos) se inicie durante o prazo de livre resolução, e a Empresa o informe previamente sobre essa consequência e obtenha o seu consentimento expresso, perderá o direito de livre resolução se o serviço for integralmente executado durante esse período.
          </p>
          <p className="mb-4 text-muted-foreground ml-4">
            <strong>d)</strong> Em caso de exercício válido do direito de livre resolução (e sem que se verifique a perda do direito), a Empresa reembolsará o Utilizador de todos os pagamentos recebidos, utilizando o mesmo meio de pagamento usado na transação inicial (salvo acordo expresso em contrário), no prazo máximo de 14 dias a contar da data em que for informada da decisão de resolução.
          </p>
          <p className="mb-6 text-muted-foreground">
            <strong>4.6.</strong> Salvo o disposto na cláusula anterior relativamente ao direito de livre resolução para consumidores, ou outra disposição legal imperativa, os montantes pagos pelos serviços não são reembolsáveis.
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. UTILIZAÇÃO DA PLATAFORMA E OBRIGAÇÕES DOS UTILIZADORES</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, detalhando as obrigações e proibições de forma clara).
          </p>

          <h2 className="text-2xl font-semibold mb-4">6. INTELIGÊNCIA ARTIFICIAL (IA)</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, enfatizando a natureza auxiliar da IA e a necessidade de consentimento para tratamentos específicos).
          </p>

          <h2 className="text-2xl font-semibold mb-4">7. CONTEÚDO DO UTILIZADOR</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, especificando a licença concedida à Empresa e a responsabilidade do Utilizador pelo conteúdo).
          </p>

          <h2 className="text-2xl font-semibold mb-4">8. PROPRIEDADE INTELECTUAL DA PLATAFORMA</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, reforçando a proteção legal dos elementos da Plataforma).
          </p>

          <h2 className="text-2xl font-semibold mb-4">9. EXONERAÇÃO DE RESPONSABILIDADE</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, sendo claro sobre as limitações da garantia e a ausência de responsabilidade por conteúdos de terceiros ou sucesso no recrutamento).
          </p>

          <h2 className="text-2xl font-semibold mb-4">10. LIMITAÇÃO DE RESPONSABILIDADE</h2>
          <p className="mb-4 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, ajustando a linguagem para conformidade com a lei portuguesa e exceções legais - dolo, negligência grosseira, responsabilidade inderrogável perante consumidores).
          </p>
          <p className="mb-4 text-muted-foreground">
            <strong>10.1.</strong> (...) a Empresa (...) não serão responsáveis perante o Utilizador ou terceiros por quaisquer danos indiretos (...).
          </p>
          <p className="mb-6 text-muted-foreground">
            <strong>10.2.</strong> A limitação de responsabilidade prevista na cláusula anterior não se aplica em casos de dolo ou negligência grosseira por parte da Empresa, nem exclui ou limita a responsabilidade que não possa ser legalmente limitada ou excluída ao abrigo da legislação portuguesa, nomeadamente a relativa aos direitos dos consumidores.
          </p>

          <h2 className="text-2xl font-semibold mb-4">11. INDEMNIZAÇÃO</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior).
          </p>

          <h2 className="text-2xl font-semibold mb-4">12. CESSAÇÃO</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, clarificando os motivos e consequências da cessação).
          </p>

          <h2 className="text-2xl font-semibold mb-4">13. LEI APLICÁVEL E RESOLUÇÃO DE LITÍGIOS</h2>
          <p className="mb-4 text-muted-foreground">
            <strong>13.1.</strong> Os presentes Termos são regidos e interpretados de acordo com a lei portuguesa.
          </p>
          <p className="mb-4 text-muted-foreground">
            <strong>13.2.</strong> Para a resolução de quaisquer litígios emergentes da interpretação ou execução dos presentes Termos, e caso não seja possível uma resolução amigável, as partes acordam submeter o litígio aos tribunais portugueses, elegendo como competente o foro da comarca de [Inserir Comarca da Sede da Empresa, ex: Lisboa], com expressa renúncia a qualquer outro, salvo disposição legal imperativa em contrário (nomeadamente em litígios com consumidores, onde pode ser competente o tribunal do domicílio do consumidor).
          </p>
          <p className="mb-6 text-muted-foreground">
            <strong>13.3.</strong> Resolução Alternativa de Litígios de Consumo (RAL): Em caso de litígio decorrente da prestação de serviços ao abrigo dos presentes Termos, o Utilizador que seja considerado consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo (RAL). A lista atualizada das Entidades RAL disponíveis pode ser consultada no Portal do Consumidor, através do sítio eletrónico www.consumidor.gov.pt. Sem prejuízo, a Happy Screem informa que [indicar se a empresa está vinculada por adesão ou imposição legal a alguma entidade RAL específica ou se não está vinculada a nenhuma]. Poderá igualmente recorrer à Plataforma Europeia de Resolução de Litígios em Linha (Plataforma RLL), um sítio eletrónico oficial gerido pela Comissão Europeia para ajudar consumidores e comerciantes a resolver os seus litígios fora dos tribunais, acessível em http://ec.europa.eu/consumers/odr/.
          </p>

          <h2 className="text-2xl font-semibold mb-4">14. ALTERAÇÕES AOS TERMOS E CONDIÇÕES</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, enfatizando a notificação prévia para alterações materiais).
          </p>

          <h2 className="text-2xl font-semibold mb-4">15. DISPOSIÇÕES DIVERSAS</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior).
          </p>

          <h2 className="text-2xl font-semibold mb-4">16. CONTACTO</h2>
          <p className="mb-6 text-muted-foreground">
            (Manter o conteúdo do rascunho anterior, garantindo que os dados estão completos e corretos).
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;