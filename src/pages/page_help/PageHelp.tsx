import { useTranslation } from 'react-i18next';
import './page_help.scss';

import datasetImg from '../../assets/help/dataset.png';
import architectureImg from '../../assets/help/architecture.png';
import trainingProcessImg from '../../assets/help/training_process.png';
import afterTrainingImg from '../../assets/help/after_training.png';

const PageHelp = () => {
    const { t } = useTranslation();

    const steps = [
        {
            title: t('help.steps.step-1.title'),
            text: t('help.steps.step-1.text'),
            image: datasetImg,
            color: '#C2185Bde',
        },
        {
            title: t('help.steps.step-2.title'),
            text: t('help.steps.step-2.text'),
            image: architectureImg,
            color: '#E64A19de',
        },
        {
            title: t('help.steps.step-3.title'),
            text: t('help.steps.step-3.text'),
            image: trainingProcessImg,
            color: '#689F38de',
        },
        {
            title: t('help.steps.step-4.title'),
            text: t('help.steps.step-4.text'),
            image: afterTrainingImg,
            color: '#00796Bde',
        },
    ];

    return (
        <div className="page-help-container">
            <div className="main-content">
                {steps.map((step, index) => (
                    <section
                        key={index}
                        className={`help-section ${index % 2 === 1 ? 'reverse' : ''}`}
                        style={{
                            ['--accent-color' as any]: step.color,
                        }}
                    >
                        <div className="help-text">
                            <h2 className="step-title" style={{ color: step.color }}>
                                {step.title}
                            </h2>
                            <p>{step.text}</p>
                        </div>
                        <div className="help-image">
                            <img src={step.image} alt={`Step ${index + 1}`} />
                        </div>
                    </section>
                ))}
            </div>

            <footer className="footer">
                <div className="footer-title">Neural Prints</div>
                <div className="footer-version">v1.0.0</div>
                <hr className="footer-separator" />
                <div className="footer-copy">{t('help.copyright')}</div>
            </footer>
        </div>
    );
};

export default PageHelp;
