<template>
  <v-card v-if="$props.selectedDialog" scrollable width="350">
    <template v-if="$props.selectedDialog.new">
      <v-text-field
        ref="commentInput"
        append-icon="mdi-close"
        label="Leave a reply"
        @click:append="createMessage"
        @keydown.enter="createMessage"
        :disabled="isSending"
        :loading="isSending"
        v-model="inputValue"
      ></v-text-field>
    </template>
    <template v-else>
      <v-card-title>Select Country</v-card-title>
      <v-divider></v-divider>
      <p v-for="comment in $props.selectedDialog.comments" :key="comment.id">
        {{ comment.message }}
      </p>
      <v-divider></v-divider>
      <v-card-actions>
        <!-- <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Save
          </v-btn> -->
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
export default {
  name: "CommentDialogModal",
  props: ["selectedDialog"],
  methods: {
    createMessage() {
      this.isSending = true;

      this.$emit("createComment", this.inputValue);
    },
    resetInput() {
      this.inputValue = "";
      this.isSending = false;
    },
  },
  data: () => ({
    inputValue: "",
    isSending: false,
  }),
};
</script>
