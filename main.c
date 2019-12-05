#include <stdio.h>
#include <string.h>
#include <stdlib.h>


#define MAX_STRINGS_PER_NODE 10
#define MAX_CHILD_NODES 8

char * cTypes[3] = {"int", "void", "char"};

typedef struct graphNode node;


struct graphNode
{
    int type;
    char* stringList[MAX_STRINGS_PER_NODE];
    node* nextNodeList[MAX_CHILD_NODES];
};


char * skipWhiteSpace(char * charP)
{
    while(*charP == ' ' || *charP == '\n' || *charP == '\t')
    {
        charP++;
    }

    return charP;
}

//Should then search for these keywords:
//[static] [inline] type functionName(argList){<body>}
//But also be aware of macros!
char * findNextFunction(char * startChar)
{
    startChar = skipWhiteSpace(startChar);

    if(*startChar == '\0')
    {
        return NULL;
    }

    

}

unsigned int getFunctionLength(char * functionStart)
{

}

size_t getFileSize(FILE ** filePP)
{
    char buffer[10];

    size_t bytesRead = 0;

    size_t fileSize = 0;

    do
    {
        bytesRead = fread(&buffer, 1, 10, *filePP);
        fileSize += bytesRead;
    } 
    while (bytesRead > 0);

    rewind(*filePP);

    return fileSize;
}


void fillFileString(FILE * fileP, char * fileString)
{
    size_t bytesRead = 0;

    do
    {
        bytesRead = fread(fileString, 1, 10, fileP);
        fileString += 10;
    } 
    while (bytesRead > 0);

    *fileString = '\0'; 
}

int main(int argc, char* argv[])
{
    printf("\nStart!\n");

    if(argc < 2)
    {
        printf("Usage: command file.c");
        exit(1);
    }

    FILE* file = fopen(argv[1], "r");

    if(!file)
    {
        perror("Could not open file!");
        exit(1);
    }

    unsigned int fileSize = getFileSize(&file);


    char * fileString = malloc(sizeof(char) * fileSize + 1);

    if(!fileString)
    {
        printf("Could not allocate memory!");
        exit(1);
    }

    fillFileString(file, fileString);

    printf("%s", fileString);

    printf("\nsize: %u\n", fileSize);

    fclose(file);
    free(fileString);

    return 0;
}