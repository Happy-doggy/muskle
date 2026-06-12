import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import MuskleLogo from '@/components/ui/MuskleLogo'
import { LEGAL_CONTACT_EMAIL } from '@/constants/legal'
import { useAuth } from '@/hooks/useAuth'
import './legal.css'

export default function LegalPage() {
  const { user } = useAuth()
  const backTo = user ? '/account' : '/'
  const backLabel = user ? 'Retour au compte' : "Retour à l'accueil"

  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="app-container legal-header-inner">
          <Link to="/" aria-label="Muskle">
            <MuskleLogo className="h-6" />
          </Link>
          <Link to={backTo} className="legal-back">
            <ArrowLeft size={16} aria-hidden />
            {backLabel}
          </Link>
        </div>
      </header>

      <main className="app-container legal-main">
        <article className="legal-doc mx-auto">
          <h1>Conditions Générales d&apos;Utilisation — Muskle</h1>
          <p className="legal-meta">Version 1.0 — Juin 2026</p>

          <hr />

          <h2 id="mentions-legales">Mentions légales</h2>

          <div className="legal-block">
            <p>
              <strong>Éditeur de l&apos;application</strong>
              <br />
              Thomas RÉAUBOURG
              <br />
              Entrepreneur Individuel
              <br />
              France
            </p>
          </div>

          <div className="legal-block">
            <p>
              <strong>Application</strong> : Muskle
              <br />
              <strong>URL</strong> :{' '}
              <a href="https://www.muskle.club" target="_blank" rel="noopener noreferrer">
                https://www.muskle.club
              </a>
            </p>
          </div>

          <div className="legal-block">
            <p>
              <strong>Hébergement</strong>
              <br />
              Vercel Inc.
              <br />
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
              <br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                https://vercel.com
              </a>
            </p>
          </div>

          <div className="legal-block">
            <p>
              <strong>Authentification et base de données</strong>
              <br />
              Google LLC (Firebase / Firestore)
              <br />
              1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis
              <br />
              <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">
                https://firebase.google.com
              </a>
            </p>
          </div>

          <hr />

          <h2 id="article-1">Article 1 — Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») ont pour objet de
            définir les modalités et conditions d&apos;utilisation de l&apos;application web Muskle
            (ci-après « l&apos;Application »), accessible à l&apos;adresse{' '}
            <a href="https://www.muskle.club" target="_blank" rel="noopener noreferrer">
              https://www.muskle.club
            </a>
            , éditée par Thomas RÉAUBOURG, entrepreneur individuel.
          </p>
          <p>
            L&apos;utilisation de l&apos;Application implique l&apos;acceptation pleine et entière des
            présentes CGU. Toute utilisation contraire aux présentes est interdite.
          </p>

          <h2 id="article-2">Article 2 — Description du service</h2>
          <p>
            Muskle est une application de planification et d&apos;exécution de séances d&apos;entraînement
            à domicile. Elle permet notamment de :
          </p>
          <ul>
            <li>Créer et organiser des exercices de musculation, yoga et kinésithérapie</li>
            <li>Planifier et suivre des séances d&apos;entraînement</li>
            <li>Accéder à une bibliothèque d&apos;exercices illustrés</li>
          </ul>
          <p>
            L&apos;Application est actuellement proposée à titre gratuit. L&apos;éditeur se réserve le
            droit de proposer, à terme, des fonctionnalités payantes complémentaires, dont les conditions
            feront l&apos;objet d&apos;une mise à jour des présentes CGU avec notification préalable aux
            utilisateurs.
          </p>

          <h2 id="article-3">Article 3 — Accès au service</h2>
          <p>
            L&apos;accès à l&apos;Application nécessite une connexion internet et un compte Google,
            utilisé via le service Firebase Authentication de Google.
          </p>
          <p>
            L&apos;Application est accessible depuis tout navigateur web moderne, sur ordinateur,
            tablette ou smartphone.
          </p>
          <p>
            L&apos;éditeur se réserve le droit de suspendre ou d&apos;interrompre l&apos;accès à
            l&apos;Application, notamment pour des raisons de maintenance, sans préavis ni indemnité.
          </p>

          <h2 id="article-4">Article 4 — Création de compte</h2>
          <p>L&apos;inscription est possible via deux méthodes :</p>
          <ul>
            <li>
              <strong>Authentification Google</strong> (Google Sign-In) : connexion via un compte Google
              existant
            </li>
            <li>
              <strong>Magic link par email</strong> : l&apos;utilisateur renseigne son adresse email et
              reçoit un lien de connexion à usage unique, sans mot de passe
            </li>
          </ul>
          <p>
            En créant un compte, l&apos;utilisateur accepte les présentes CGU et déclare avoir lu la
            politique de confidentialité.
          </p>
          <p>
            L&apos;utilisateur est responsable de la confidentialité de son accès et de l&apos;utilisation
            qui en est faite depuis son compte. En cas d&apos;utilisation du magic link, il est notamment
            responsable de la sécurité de l&apos;accès à sa boîte email.
          </p>

          <h2 id="article-5">Article 5 — Obligations de l&apos;utilisateur</h2>
          <p>L&apos;utilisateur s&apos;engage à :</p>
          <ul>
            <li>Utiliser l&apos;Application conformément à sa destination et aux présentes CGU</li>
            <li>Ne pas tenter de porter atteinte au bon fonctionnement de l&apos;Application</li>
            <li>
              Ne pas utiliser l&apos;Application à des fins commerciales sans autorisation préalable écrite
              de l&apos;éditeur
            </li>
            <li>Fournir des informations exactes lors de la création de son compte</li>
          </ul>

          <h2 id="article-6">Article 6 — Responsabilité</h2>
          <h3>6.1 Activité physique</h3>
          <p>
            L&apos;Application propose des contenus liés à l&apos;activité physique à titre informatif
            uniquement. L&apos;éditeur ne saurait être tenu responsable des blessures, dommages corporels
            ou problèmes de santé pouvant résulter de la pratique des exercices proposés.
          </p>
          <p>
            Il appartient à l&apos;utilisateur de consulter un professionnel de santé avant de débuter tout
            programme d&apos;exercice physique, en particulier en cas d&apos;antécédents médicaux.
          </p>
          <h3>6.2 Disponibilité du service</h3>
          <p>
            L&apos;éditeur s&apos;efforce d&apos;assurer la disponibilité de l&apos;Application mais ne
            garantit pas une accessibilité ininterrompue. L&apos;éditeur ne saurait être tenu responsable
            des interruptions de service, pertes de données ou tout autre dommage lié à l&apos;utilisation
            de l&apos;Application.
          </p>

          <h2 id="article-7">Article 7 — Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des éléments constituant l&apos;Application (design, code, textes,
            illustrations, vidéos, marque Muskle) est la propriété exclusive de Thomas RÉAUBOURG ou fait
            l&apos;objet de licences d&apos;utilisation en bonne et due forme.
          </p>
          <p>
            Toute reproduction, représentation, modification ou exploitation non autorisée de ces éléments
            est strictement interdite.
          </p>

          <h2 id="article-8">Article 8 — Modification des CGU</h2>
          <p>
            L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les
            utilisateurs seront informés de toute modification substantielle par notification dans
            l&apos;Application ou par email. La poursuite de l&apos;utilisation de l&apos;Application
            après notification vaut acceptation des nouvelles CGU.
          </p>

          <h2 id="article-9">Article 9 — Droit applicable et juridiction</h2>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution
            amiable, les tribunaux français seront seuls compétents.
          </p>

          <hr className="legal-section-divider" />

          <h1 id="politique-confidentialite">
            Politique de Confidentialité et Protection des Données (RGPD)
          </h1>
          <p className="legal-meta">Dernière mise à jour : Juin 2026</p>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE
            2016/679) et à la loi Informatique et Libertés, Thomas RÉAUBOURG, en qualité de responsable
            de traitement, s&apos;engage à protéger la vie privée des utilisateurs de l&apos;Application
            Muskle.
          </p>

          <h2 id="rgpd-1">1. Responsable du traitement</h2>
          <div className="legal-block">
            <p>
              <strong>Thomas RÉAUBOURG</strong>
              <br />
              Entrepreneur Individuel
              <br />
              France
              <br />
              Contact :{' '}
              <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
            </p>
          </div>

          <h2 id="rgpd-2">2. Données collectées</h2>
          <p>Dans le cadre de l&apos;utilisation de l&apos;Application, les données suivantes sont collectées :</p>
          <p>
            <strong>Données d&apos;identification (via Google Sign-In)</strong>
          </p>
          <ul>
            <li>Adresse email</li>
            <li>Nom d&apos;affichage Google</li>
            <li>Identifiant unique Firebase (UID)</li>
          </ul>
          <p>
            <strong>Données d&apos;utilisation</strong>
          </p>
          <ul>
            <li>Date et heure de création du compte</li>
            <li>Date et heure de dernière connexion</li>
            <li>Nombre de sessions réalisées</li>
            <li>Nombre de séances d&apos;entraînement complétées</li>
          </ul>
          <p>
            <strong>Données de contenu</strong>
          </p>
          <ul>
            <li>Exercices créés par l&apos;utilisateur</li>
            <li>Séances d&apos;entraînement planifiées et réalisées</li>
          </ul>

          <h2 id="rgpd-3">3. Finalités du traitement</h2>
          <p>Les données collectées sont utilisées aux fins suivantes :</p>
          <table>
            <thead>
              <tr>
                <th>Finalité</th>
                <th>Base légale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fonctionnement du compte utilisateur</td>
                <td>Exécution du contrat (CGU)</td>
              </tr>
              <tr>
                <td>Authentification sécurisée</td>
                <td>Exécution du contrat</td>
              </tr>
              <tr>
                <td>Suivi de l&apos;utilisation du service (métriques agrégées)</td>
                <td>Intérêt légitime de l&apos;éditeur</td>
              </tr>
              <tr>
                <td>Amélioration de l&apos;Application</td>
                <td>Intérêt légitime de l&apos;éditeur</td>
              </tr>
              <tr>
                <td>Notification en cas de modification des CGU</td>
                <td>Obligation légale / Exécution du contrat</td>
              </tr>
            </tbody>
          </table>

          <h2 id="rgpd-4">4. Durée de conservation</h2>
          <p>
            Les données sont conservées pendant toute la durée d&apos;utilisation du compte, puis
            supprimées dans un délai de <strong>12 mois</strong> suivant la suppression du compte ou la
            dernière connexion.
          </p>

          <h2 id="rgpd-5">5. Destinataires des données</h2>
          <p>
            Les données peuvent être transmises aux sous-traitants suivants, dans le strict cadre de la
            fourniture du service :
          </p>
          <ul>
            <li>
              <strong>Google LLC / Firebase</strong> — authentification, base de données, hébergement des
              fichiers (politique de confidentialité :{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                https://policies.google.com/privacy
              </a>
              )
            </li>
            <li>
              <strong>Vercel Inc.</strong> — hébergement de l&apos;Application (politique de
              confidentialité :{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                https://vercel.com/legal/privacy-policy
              </a>
              )
            </li>
          </ul>
          <p>
            Aucune donnée personnelle n&apos;est vendue, louée ou cédée à des tiers à des fins
            commerciales.
          </p>

          <h2 id="rgpd-6">6. Transferts hors Union Européenne</h2>
          <p>
            Firebase (Google) et Vercel sont des prestataires américains. Ces transferts sont encadrés par
            les clauses contractuelles types de la Commission Européenne et les mécanismes de conformité
            applicables.
          </p>

          <h2 id="rgpd-7">7. Droits des utilisateurs</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :</p>
          <ul>
            <li>
              <strong>Droit d&apos;accès</strong> — obtenir une copie de vos données
            </li>
            <li>
              <strong>Droit de rectification</strong> — corriger des données inexactes
            </li>
            <li>
              <strong>Droit à l&apos;effacement</strong> — demander la suppression de vos données
            </li>
            <li>
              <strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré
            </li>
            <li>
              <strong>Droit d&apos;opposition</strong> — vous opposer à certains traitements
            </li>
            <li>
              <strong>Droit à la limitation</strong> — demander la limitation du traitement
            </li>
          </ul>
          <p>
            Pour exercer ces droits, contactez l&apos;éditeur à l&apos;adresse :{' '}
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
          </p>
          <p>
            Vous disposez également du droit d&apos;introduire une réclamation auprès de la{' '}
            <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) :{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
              https://www.cnil.fr
            </a>
          </p>

          <h2 id="rgpd-8">8. Cookies et traceurs</h2>
          <p>
            L&apos;Application utilise uniquement des cookies techniques strictement nécessaires au
            fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de tracking
            tiers n&apos;est déposé.
          </p>

          <h2 id="rgpd-9">9. Sécurité</h2>
          <p>
            L&apos;éditeur met en œuvre les mesures techniques et organisationnelles appropriées pour
            protéger les données personnelles contre tout accès non autorisé, perte ou altération,
            notamment via le protocole HTTPS et les mécanismes de sécurité de Firebase.
          </p>

          <p className="legal-disclaimer">
            Ces CGU et cette politique de confidentialité ont été rédigées pour l&apos;Application Muskle
            éditée par Thomas RÉAUBOURG. Elles constituent un document de bonne foi et ne constituent pas
            un avis juridique. Pour toute situation complexe (évolution commerciale significative, litige),
            il est recommandé de consulter un avocat spécialisé.
          </p>
        </article>
      </main>
    </div>
  )
}
