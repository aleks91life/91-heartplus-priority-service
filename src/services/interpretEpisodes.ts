import { EpisodeRule, Issue, EpisodeRuleData, PriorityRuleCause, StringOperation } from "../types";



export async function interpretEpisodes(rule: EpisodeRuleData, episode: JSON): Promise<PriorityRuleCause | undefined> 
{

        let cause: PriorityRuleCause = {
            type: ['episode', episode['type'], episode['episodeId']],
            issues: []
        }
        if (!(rule.position.episode?.includes(episode['type']))) return undefined;
        if ('duration' in episode && episode['duration'] !== null )
        {
            const issue = interpretEpisodeDuration(rule, episode);
            if (issue) cause.issues.push(issue);
            else return;
        }

        // TODO: Check if this is correct
        if ('treated' in rule['valueRange'] && rule['valueRange'].treated !== null)
        {
            const episodeTreatedIssue = interpretEpisodeTreated(rule, episode);
            if (episodeTreatedIssue) cause.issues.push(episodeTreatedIssue);
            else return;
        }

        if
        ('episodeID' in rule['valueRange'] && rule['valueRange'].episodeID !== null) {
            const episodeIdIssue = interpretEpisodeId(rule, episode);
            if (episodeIdIssue) cause.issues.push(episodeIdIssue);
            else return;
        }

        if ('detectionTherapy' in rule['valueRange'] && rule['valueRange'].detectionTherapy !== null) 
        {
            console.log('detTherapy', rule['valueRange'].detectionTherapy );

            const detectionTherapyIssue = interpretEpisodeDetectionTherapy(rule, episode);
            console.log('detectionTherapyIssue', detectionTherapyIssue);
            if (detectionTherapyIssue) cause.issues.push(detectionTherapyIssue);
            else return;
        }


        return cause;

}



function interpretEpisodeTreated(rule: EpisodeRuleData, episode: JSON): Issue | undefined
{       

        const therapyResult = (episode['therapyResult'] === "Successful") ||
        (episode['therapyResult'] === "Unsuccessful") ? true : false;

        if (therapyResult !== rule['valueRange'].treated)
            return {
                fieldName: 'treated',
                 value: episode['therapyResult']
            };
        else return;
    
}


function interpretEpisodeId(rule: EpisodeRuleData, episode: JSON): Issue | undefined
{
    const episodeIDs = rule.valueRange.episodeID;

    if (!episodeIDs) {
        return undefined; 
    }

    const episodeId = episode['episodeId']; 

    const episodeIDsArray: StringOperation[] = Array.isArray(episodeIDs) ? episodeIDs : [episodeIDs];

    for (const id of episodeIDsArray) {
        const { operator, content } = id;

        let conditionMet = false;

        switch (operator) {
            case 'is':
                conditionMet = episodeId === content;
                break;
            case 'not':
                conditionMet = episodeId !== content;
                break;
            case 'contains':
                conditionMet = episodeId.includes(content);
                break;
            case 'not contains':
                conditionMet = !episodeId.includes(content);
                break;
        }
        if (conditionMet) {
            return {
                fieldName: 'episodeId',
                value: content
            };
        }
    }

    return undefined; 


}

function interpretEpisodeDuration(rule: EpisodeRuleData, episode: JSON): Issue | undefined
{
    if (rule.valueRange.duration_max && rule.valueRange.duration_min)
    {
        if (episode['duration'] > rule.valueRange.duration_max && episode['duration'] < rule.valueRange.duration_min)
        {
            return {
                fieldName: 'duration',
                value: episode['duration']
            }
        }
    }
    else if (rule.valueRange.duration_max &&  episode['duration'] < rule.valueRange?.duration_max)
    {
        return {
            fieldName: 'duration',
            value: episode['duration']
        }
    }
    else if (rule.valueRange.duration_min && episode['duration'] > rule.valueRange.duration_min)
    {
        console.log('durationmin ', rule.valueRange.duration_min);
        return {
            fieldName: 'duration',
            value: episode['duration']
        }

    }
    return undefined;
}

function interpretEpisodeDetectionTherapy(rule: EpisodeRuleData, episode: JSON): Issue | undefined
{
    // currently checks only if at least one matches the string
    const detectionTherapy = rule.valueRange.detectionTherapy;
    if (!detectionTherapy) return undefined;
    const episodeDetectionTherapy = episode['detectionTherapyDetails'];

    // handling cases when detection therapy have different operators, therefore it's an array of objects
    const detectionTherapyArray: StringOperation[] = Array.isArray(detectionTherapy) ? detectionTherapy : [detectionTherapy];
    console.log('detectionTherapyArray', detectionTherapyArray);
    for (const therapy of detectionTherapyArray) {
        const { operator, content } = therapy;
        let conditionMet = false;

        const contentArray = content.split(';').map(item => item.trim());
        switch (operator) {
            case 'is':
                conditionMet = contentArray.some(item => episodeDetectionTherapy === item);
                break;
            case 'not':
                conditionMet = contentArray.some(item => episodeDetectionTherapy !== item);
                break;
            case 'contains':
                conditionMet = contentArray.some(item => episodeDetectionTherapy.includes(item));
                break;
            case 'not contains':
                conditionMet = contentArray.some(item => !episodeDetectionTherapy.includes(item));
                break;
        }
        if (conditionMet) {
            return {
                fieldName: 'detectionTherapyDetails',
                value: content
            };
        }
    }

    return undefined;
}