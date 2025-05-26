import { useDatasetStore } from '../store/DatasetStore';
import { useArchitectureStore } from '../store/ArchitectureStore';

import md5 from 'md5';

export const getModelHash = (): string | null => {
    const architectureHash = useArchitectureStore.getState().architecture_hash;
    const datasetFile = useDatasetStore.getState().dataset_file;

    if (!architectureHash || !datasetFile) return null;

    const datasetName = datasetFile.name;

    console.log(`[getModelHash()] --- architectureHash: ${architectureHash}`)
    console.log(`[getModelHash()] --- datasetName: ${datasetName}`)

    const modelHash = md5(`${architectureHash}${datasetName}`);
    return modelHash;
};
